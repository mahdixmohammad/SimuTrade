"use client";
import { RootState } from "@/lib/store";
import { useAppSelector } from "@/lib/hooks";
import { changePNL, selectPNL } from "@/lib/slice";
import { useEffect } from "react";

export default function Dashboard() {
	const pnl = useAppSelector(selectPNL);

	useEffect(() => {
		const span: HTMLSpanElement = document.querySelector("span")!;
		if (pnl > 0) span.style.color = "rgb(0, 167, 114)";
		else if (pnl < 0) span.style.color = "rgb(255, 50, 50)";
		else span.style.color = "gray";
	});

	return (
		<div className="w-8/12 h-[600px] bg-gray-900 mx-auto border-2 border-white rounded-2xl pt-5 px-12 mt-20">
			<h2 className="text-white text-3xl">Trader&apos;s Dashboard</h2>
			<div className="h-5/6 text-xl text-white mt-5 text-left flex flex-col gap-6">
				<p>
					Account Balance: <span>${pnl.toFixed(2)}</span>
				</p>
				<p>Profit and Loss:</p>
				<p>Wins:</p>
				<p>Losses:</p>
				<p>Winrate:</p>
				<p>Units:</p>
				<p>Average Win:</p>
				<p>Average Loss:</p>
				<p>Average Trade Duration:</p>
			</div>
		</div>
	);
}
