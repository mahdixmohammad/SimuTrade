"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/actions/action"; // Assuming this is a client-side function

export default function Dashboard() {
	const [user, setUser] = useState<any>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function fetchUser() {
			try {
				const userData = await getUser();
				setUser(userData);
			} catch (error) {
				console.error("Error fetching user:", error);
			} finally {
				setLoading(false);
			}
		}

		fetchUser();
	}, []); // Empty array to fetch data once

	// Loading state while the user is being fetched
	if (loading) {
		return <div className="h-[80vh] flex items-center justify-center text-4xl text-center text-white">Loading user data...</div>;
	}

	// Handle case if user is null
	if (!user) {
		return <p>Error: Unable to fetch user data</p>;
	}

	const { firstName, dashboard } = user;
	const { pnl, accountBalance, wins, losses, winrate, units, totalTradeDuration, averageWin, averageLoss, averageUnits, averageTradeDuration } =
		dashboard;

	return (
		<div className="w-11/12 sm:w-8/12 text-white mx-auto pt-5 px-12 mt-6">
			<h2 className="w-fit text-4xl text-center border-b-2 pb-1 mx-auto">{firstName}&apos;s Dashboard:</h2>
			<div className="h-5/6 text-2xl mt-7 text-left flex flex-col gap-6">
				<p>
					Account Balance:{" "}
					<span
						style={{
							color: accountBalance > 10000 ? "rgb(0, 167, 114)" : accountBalance < 10000 ? "rgb(255, 50, 50)" : "gray",
						}}
					>
						${accountBalance.toFixed(2)}
					</span>
				</p>
				<p>
					Profit and Loss:{" "}
					<span
						style={{
							color: pnl > 0 ? "rgb(0, 167, 114)" : pnl < 0 ? "rgb(255, 50, 50)" : "gray",
						}}
					>
						${pnl.toFixed(2)}
					</span>
				</p>
				<p>
					Wins: <span style={{ color: "rgb(0, 167, 114)" }}>{wins}</span>
				</p>
				<p>
					Losses: <span style={{ color: "rgb(255, 50, 50)" }}>{losses}</span>
				</p>
				<p>
					Winrate:{" "}
					<span
						style={{
							color: winrate > 50 ? "rgb(0, 167, 114)" : winrate < 50 ? "rgb(255, 50, 50)" : "gray",
						}}
					>
						{winrate.toFixed(2)}%
					</span>
				</p>
				<p>
					Units: <span style={{ color: "gray" }}>{units}</span>
				</p>
				<p>
					Total Trade Duration: <span style={{ color: "gray" }}>{totalTradeDuration} hours</span>
				</p>
				<p>
					Average Win: <span style={{ color: "rgb(0, 167, 114)" }}>${averageWin.toFixed(2)}</span>
				</p>
				<p>
					Average Loss: <span style={{ color: "rgb(255, 50, 50)" }}>${averageLoss.toFixed(2)}</span>
				</p>
				<p>
					Average Units: <span style={{ color: "gray" }}>{averageUnits}</span>
				</p>
				<p>
					Average Trade Duration: <span style={{ color: "gray" }}>{averageTradeDuration} hours</span>
				</p>
			</div>
		</div>
	);
}
