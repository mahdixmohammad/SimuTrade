import { getUser } from "@/actions/action";

export default async function Dashboard() {
	const user = (await getUser())[0];
	const { firstName } = user;
	const { dashboard } = user;

	const { pnl, accountBalance, wins, losses, winrate, units, totalTradeDuration, averageWin, averageLoss, averageUnits, averageTradeDuration } =
		dashboard;

	return (
		<div className="w-8/12 h-[660px] text-white mx-auto pt-5 px-12 mt-6">
			<h2 className=" text-4xl text-center">{firstName}&apos;s Dashboard, </h2>
			<div className="h-5/6 text-2xl mt-7 text-left flex flex-col gap-6">
				<p>
					Account Balance:{" "}
					<span
						id="account-balance"
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
						id="pnl"
						style={{
							color: pnl > 0 ? "rgb(0, 167, 114)" : pnl < 0 ? "rgb(255, 50, 50)" : "gray",
						}}
					>
						${pnl.toFixed(2)}
					</span>
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
					<span
						id="winrate"
						style={{
							color: winrate > 50 ? "rgb(0, 167, 114)" : winrate < 50 ? "rgb(255, 50, 50)" : "gray",
						}}
					>
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
					<span id="average-units" style={{ color: "gray" }}>
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
