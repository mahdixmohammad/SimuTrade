function Candlestick(props: {
	color: "red" | "green";
	xPosition: number;
	yPosition: number;
}) {
	const candlePosition = {
		top: `${props.yPosition}px`,
		// left: `${40 * props.xPosition}px`,
	};

	const candleColor = {
		backgroundColor:
			props.color === "green" ? "rgb(0, 167, 114)" : "rgb(255, 50, 50)",
	};

	return (
		<div
			className="w-fit h-fit flex flex-col items-center relative"
			style={candlePosition}
		>
			<div className="w-1 h-10" style={candleColor}></div>
			<div className="candle-body w-10 h-24" style={candleColor}></div>
			<div className="w-1 h-10" style={candleColor}></div>
		</div>
	);
}

export default Candlestick;
