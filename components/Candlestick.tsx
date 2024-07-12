import React, { useEffect } from "react";

const Candlestick = React.forwardRef(
	(
		props: {
			color: "red" | "green";
			bodySize: number;
			topwickSize: number;
			bottomwickSize: number;
			xPosition: number;
			yPosition: number;
		},
		ref: any
	) => {
		const candlePosition = {
			top: `${props.yPosition}px`,
		};

		const candleTopWickStyle = {
			height: props.topwickSize,
			backgroundColor: props.color === "green" ? "rgb(0, 167, 114)" : "rgb(255, 50, 50)",
		};

		const candleBodyStyle = {
			height: props.bodySize,
			backgroundColor: props.color === "green" ? "rgb(0, 167, 114)" : "rgb(255, 50, 50)",
		};

		const candleBottomWickStyle = {
			height: props.bottomwickSize,
			backgroundColor: props.color === "green" ? "rgb(0, 167, 114)" : "rgb(255, 50, 50)",
		};

		useEffect(() => {
			if (ref && ref.current) {
				ref.current.scrollIntoView({ block: "center" });
			}
		}, [ref]);

		return (
			<div className="w-fit h-fit flex flex-col items-center relative my-96" style={candlePosition} ref={ref}>
				<div className="w-1" style={candleTopWickStyle}></div>
				<div className="w-10" style={candleBodyStyle}></div>
				<div className="w-1" style={candleBottomWickStyle}></div>
			</div>
		);
	}
);

Candlestick.displayName = "Candlestick";

export default Candlestick;
