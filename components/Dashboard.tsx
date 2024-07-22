"use client";
import { useAppSelector } from "@/lib/hooks";
import {
	selectAccountBalance,
	selectPNL,
	selectWins,
	selectLosses,
	selectWinrate,
	selectUnits,
	selectTotalTradeDuration,
	selectAverageWin,
	selectAverageLoss,
	selectAverageUnits,
	selectAverageTradeDuration,
} from "@/lib/slice";
import { useEffect } from "react";

export default function Dashboard() {
	const pnl = useAppSelector(selectPNL);
	const accountBalance = useAppSelector(selectAccountBalance);
	const wins = useAppSelector(selectWins);
	const losses = useAppSelector(selectLosses);
	const winrate = useAppSelector(selectWinrate);
	const units = useAppSelector(selectUnits);
	const totalTradeDuration = useAppSelector(selectTotalTradeDuration);
	const averageWin = useAppSelector(selectAverageWin);
	const averageLoss = useAppSelector(selectAverageLoss);
	const averageUnits = useAppSelector(selectAverageUnits);
	const averageTradeDuration = useAppSelector(selectAverageTradeDuration);

	useEffect(() => {
		const updateElementColor = (element: HTMLSpanElement, value: number, threshold: number) => {
			if (value > threshold) {
				element.style.color = "rgb(0, 167, 114)";
			} else if (value < threshold) {
				element.style.color = "rgb(255, 50, 50)";
			} else {
				element.style.color = "gray";
			}
		};

		updateElementColor(document.querySelector("span#account-balance")!, accountBalance, 10000);
		updateElementColor(document.querySelector("span#pnl")!, pnl, 0);
		updateElementColor(document.querySelector("span#winrate")!, pnl, 50);
	});

	return (
		<div className="w-8/12 h-[660px] bg-gray-900 mx-auto border-2 border-white rounded-2xl pt-5 px-12 mt-20">
			<h2 className="text-white text-3xl">Trader&apos;s Dashboard</h2>
			<div className="h-5/6 text-xl text-white mt-5 text-left flex flex-col gap-6">
				<p>
					Account Balance: <span id="account-balance">${accountBalance.toFixed(2)}</span>
				</p>
				<p>
					Profit and Loss: <span id="pnl">${pnl.toFixed(2)}</span>
				</p>
				<p>
					Wins:{" "}
					<span id="wins" style={{ color: "rgb(0, 167, 114)" }}>
						{wins}
					</span>
				</p>
				<p>
					Losses:{" "}
					<span id="losses" style={{ color: "rgb(255, 50, 50)" }}>
						{losses}
					</span>
				</p>
				<p>
					Winrate:{" "}
					<span id="winrate" style={{ color: "gray" }}>
						{winrate.toFixed(2)}%
					</span>
				</p>
				<p>
					Units:{" "}
					<span id="units" style={{ color: "gray" }}>
						{units}
					</span>
				</p>
				<p>
					Total Trade Duration:{" "}
					<span id="average-trade-duration" style={{ color: "gray" }}>
						{totalTradeDuration} hours
					</span>
				</p>
				<p>
					Average Win:{" "}
					<span id="average-win" style={{ color: "rgb(0, 167, 114)" }}>
						${averageWin.toFixed(2)}
					</span>
				</p>
				<p>
					Average Loss:{" "}
					<span id="average-loss" style={{ color: "rgb(255, 50, 50)" }}>
						${averageLoss.toFixed(2)}
					</span>
				</p>
				<p>
					Average Units:{" "}
					<span id="average-loss" style={{ color: "gray" }}>
						{averageUnits}
					</span>
				</p>
				<p>
					Average Trade Duration:{" "}
					<span id="average-trade-duration" style={{ color: "gray" }}>
						{averageTradeDuration} hours
					</span>
				</p>
			</div>
		</div>
	);
}
