"use server";

import dbConnect from "@/lib/db";
import User from "@/models/User";
import { ObjectId } from "mongodb";
import { createSession, verifySession } from "@/lib/session";
import { redirect } from "next/navigation";

const signup = async (user: FormData) => {
	await dbConnect();

	const firstName = user.get("First Name");
	const lastName = user.get("Last Name");
	const email = user.get("Email");
	const username = user.get("Username");
	const password = user.get("Password");
	const confirmPassword = user.get("Confirm Password");

	if ((await User.find({ username })).length != 0) {
		return { status: -1, message: "Username already taken." };
	}

	if (password !== confirmPassword) {
		return { status: -1, message: "Passwords do not match." };
	}

	const newUser = new User({ firstName, lastName, email, username, password });

	try {
		await newUser.save();
	} catch (error: any) {
		return { status: -1, message: error.message };
	}

	const userInfo = await User.find({ username });

	await createSession(userInfo[0].id);
	redirect("/dashboard");
};

const login = async (user: FormData) => {
	await dbConnect();

	const username = user.get("Username");
	const password = user.get("Password");

	const userInfo = await User.find({ username, password });

	if (userInfo.length === 0) {
		return;
	}

	await createSession(userInfo[0].id);
	redirect("/dashboard");
};

const getUser = async () => {
	await dbConnect();
	const { isAuth, userId }: { isAuth: boolean; userId: string } = await verifySession();

	// Check if user is authenticated
	if (!isAuth) {
		throw new Error("User not authenticated");
	}

	const id = new ObjectId(userId);

	// Use 'lean()' to get a plain JavaScript object
	const user = await User.findOne({ _id: id }).lean();

	// Ensure user exists
	if (!user) {
		throw new Error("User not found");
	}

	return user; // Return the plain object, ready to be serialized
};

const updateUserDashboard = async (newPnl: number, newUnits: number, tradeStartTimestamp: number, tradeEndTimestamp: number) => {
	await dbConnect();
	const { isAuth, userId }: { isAuth: boolean; userId: string } = await verifySession();

	const id = new ObjectId(userId);

	const user = (await User.find({ _id: id }))[0];
	const { dashboard } = user;
	let { accountBalance, pnl, wins, losses, winrate, units, totalTradeDuration, averageWin, averageLoss, averageUnits, averageTradeDuration } =
		dashboard;
	console.log(dashboard);

	accountBalance += newPnl;
	pnl += newPnl;

	if (newPnl > 0) {
		averageWin = (averageWin * wins + newPnl) / (wins + 1);
		wins += 1;
	}
	if (newPnl < 0) {
		averageLoss = (averageLoss * losses + newPnl) / (losses + 1);
		losses += 1;
	}

	winrate = (wins / (wins + losses)) * 100;
	units += newUnits;
	averageUnits = (averageUnits * (wins + losses - 1) + newUnits) / (wins + losses);
	const tradeStartDate = new Date(tradeStartTimestamp);
	const tradeEndDate = new Date(tradeEndTimestamp);
	const tradeDurationDifference = Math.round((tradeEndDate.getTime() - tradeStartDate.getTime()) / (1000 * 3600));
	totalTradeDuration += tradeDurationDifference;
	averageTradeDuration = (averageTradeDuration * (wins + losses - 1) + tradeDurationDifference) / (wins + losses);

	await User.updateOne(
		{ _id: id },
		{
			dashboard: {
				accountBalance,
				pnl,
				wins,
				losses,
				winrate,
				units,
				totalTradeDuration,
				averageWin,
				averageLoss,
				averageUnits,
				averageTradeDuration,
			},
		}
	);
};

export { signup, login, getUser, updateUserDashboard };
