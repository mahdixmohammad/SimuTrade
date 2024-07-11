import "./Candlestick.css";

function Candlestick(props) {
	var r = document.querySelector(":root");

	if (props.color == "green") {
		r.style.setProperty("--candle-color", "rgb(0, 167, 114)");
	}

	if (props.color == "red") {
		r.style.setProperty("--candle-color", "rgb(255, 50, 50)");
	}

	return (
		<div className="candle-body">
			<div className="candle-wick-top"></div>
			<div className="candle-wick-bottom"></div>
		</div>
	);
}

export default Candlestick;
