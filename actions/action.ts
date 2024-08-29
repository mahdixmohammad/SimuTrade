"use server";

import dbConnect from "@/lib/db";
import User from "@/models/User";
import { createSession } from "@/lib/session";
import { redirect } from "next/navigation";

const addUser = async (user: FormData) => {
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
	return { status: 1, message: "" };
};

const getUser = async (user: FormData) => {
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

export { addUser, getUser };
