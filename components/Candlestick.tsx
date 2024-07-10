function Candlestick(props: {
	color: "red" | "green";
	bodySize: number;
	topwickSize: number;
	bottomwickSize: number;
	xPosition: number;
	yPosition: number;
}) {
	const candlePosition = {
		top: `${props.yPosition}px`,
		// left: `${40 * props.xPosition}px`,
	};

	const candleTopWickStyle = {
		height: props.topwickSize,
		backgroundColor:
			props.color === "green" ? "rgb(0, 167, 114)" : "rgb(255, 50, 50)",
	};

	const candleBodyStyle = {
		height: props.bodySize,
		backgroundColor:
			props.color === "green" ? "rgb(0, 167, 114)" : "rgb(255, 50, 50)",
	};

	const candleBottomWickStyle = {
		height: props.bottomwickSize,
		backgroundColor:
			props.color === "green" ? "rgb(0, 167, 114)" : "rgb(255, 50, 50)",
	};

	return (
		<div
			className="w-fit h-fit flex flex-col items-center relative my-96"
			style={candlePosition}
		>
			<div className="w-1" style={candleTopWickStyle}></div>
			<div className="w-10" style={candleBodyStyle}></div>
			<div className="w-1" style={candleBottomWickStyle}></div>
		</div>
	);
}

export default Candlestick;
