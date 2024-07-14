"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

export default function Canvas() {
	interface Candlestick {
		date: Date;
		openingPrice: number;
		closingPrice: number;
		topWickHeight: number;
		bodyHeight: number;
		bottomWickHeight: number;
	}

	// initializes state of application
	const [currentY, setY] = useState(200);
	const [data, setData] = useState<Record<string, Candlestick>>({});
	const [count, setCount] = useState(0);

	// set React DOM references
	const canvasRef = useRef(null);
	const contextRef = useRef<CanvasRenderingContext2D | null>(null);

	// returns a random integer between min and max (both inclusive)
	function getRandomInt(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	// returns a random float between min and max (both inclusive)
	function getRandomFloat(min: number, max: number): number {
		return Math.random() * (max - min) + min;
	}

	useEffect(() => {
		// initializes canvas
		const canvas: HTMLCanvasElement = canvasRef.current!;
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
		const c = canvas.getContext("2d")!;
		contextRef.current = c;
	}, []);

	const handleAdd = async () => {
		const c = contextRef.current!;
		// the x-coordinate of each candlestick (40 pixels wide)
		const x: number = count * 40;
		// map numbers to a color and its rgb value
		const colors = new Map([
			[0, ["red", "rgb(255, 50, 50)"]],
			[1, ["green", "rgb(0, 167, 114)"]],
		]);
		// randomly picks either 0 or 1
		const random = getRandomInt(0, 1);
		// destructures the array mapped to 0 or 1
		const [color, rgb] = colors.get(random)!;

		// randomly pick the sizes of the candlestick body and wicks
		let bodyHeight = getRandomInt(12.5, 100);
		// bodyHeight = color === "green" ? bodyHeight : -bodyHeight;
		const topWickHeight = getRandomInt(0, 45);
		const bottomWickHeight = getRandomInt(0, 45);
		let newY: number;
		let newCandlestick: Candlestick = {
			date: new Date(),
			openingPrice: currentY,
			closingPrice: currentY - bodyHeight,
			topWickHeight: topWickHeight,
			bodyHeight: bodyHeight,
			bottomWickHeight: bottomWickHeight,
		};

		// green means negative y (candle goes up), red means positive y (candle goes down)
		if (color === "green") {
			newY = currentY - bodyHeight;

			// creates the candlestick body
			c.fillStyle = rgb;
			c.fillRect(x, newY, 40, bodyHeight);

			// creates the candlestick wicks
			c.strokeStyle = rgb;
			c.lineWidth = 4;
			c.beginPath();
			// moves the line in between the candlestick body at its top
			c.moveTo(x + 20, newY - topWickHeight);
			// draws the top wick
			c.lineTo(x + 20, newY);
			// moves the line in between the candlestick body at its bottom
			c.moveTo(x + 20, newY + bodyHeight);
			// draws the bottom wick
			c.lineTo(x + 20, newY + bodyHeight + bottomWickHeight);
			c.stroke();
		} else {
			newY = currentY + bodyHeight;

			// creates the candlestick body
			c.fillStyle = rgb;
			c.fillRect(x, newY, 40, -bodyHeight);

			c.strokeStyle = rgb;
			c.lineWidth = 4;
			// creates the candlestick wicks
			c.beginPath();
			// moves the line in between the candlestick body at its top
			c.moveTo(x + 20, newY - bodyHeight - topWickHeight);
			// draws the top wick
			c.lineTo(x + 20, newY);
			// moves the line in between the candlestick body at its bottom
			c.moveTo(x + 20, newY);
			// draws the bottom wick
			c.lineTo(x + 20, newY + bottomWickHeight);
			c.stroke();
		}

		// sets new states
		setY(newY);
		setData(prevData => ({
			...prevData,
			[count + 1]: newCandlestick,
		}));
		setCount(count + 1);
	};

	const handleDelete = () => {
		if (count > 0) {
			const c = contextRef.current!;
			c.clearRect((count - 1) * 40, 0, 40, 1000);
			setCount(count - 1);
		}
	};

	return (
		<>
			<canvas ref={canvasRef} className="w-11/12 h-[600px] bg-gray-900 mx-auto border-2 border-white"></canvas>
			<div className="flex justify-center items-center gap-4 md:gap-6 mx-auto bg-gray-900 w-10/12 sm:w-2/4 md:w-[450px] h-20 my-8 rounded-2xl border-2 border-white">
				<Image
					className="w-10 md:w-[50px] mx-4 md:mx-8 cursor-pointer"
					src="/fastbackward-icon.png"
					alt="Fast Backward"
					title="Fast Backward"
					width={50}
					height={0}
					style={{ height: "auto" }}
					onClick={() => {
						// setForwarding(false);
						// setBackwarding(true);
					}}
				/>
				<Image
					className="w-7 md:w-[35px] cursor-pointer"
					src="/backward-icon.png"
					alt="Backward"
					title="Backward"
					width={35}
					height={0}
					style={{ height: "auto" }}
					onClick={handleDelete}
				/>
				{/* {fastforwarding || fastBackwarding ? (
					<Image
						className="w-7 md:w-[35px] cursor-pointer"
						src="/pause-icon.png"
						alt="Pause"
						title="Pause"
						width={35}
						height={0}
						style={{ height: "auto" }}
						onClick={() => {
							setForwarding(false);
							setBackwarding(false);
						}}
					/>
				) : (
					<Image
						className="w-7 md:w-[35px] cursor-pointer"
						src="/play-icon.png"
						alt="Play"
						title="Play"
						width={35}
						height={0}
						style={{ height: "auto" }}
					/>
				)} */}
				<Image
					className="w-7 md:w-[35px] cursor-pointer"
					src="/forward-icon.png"
					alt="Forward"
					title="Forward"
					width={35}
					height={0}
					style={{ height: "auto" }}
					onClick={handleAdd}
				/>
				<Image
					className="w-10 md:w-[50px] mx-4 md:mx-8 cursor-pointer"
					src="/fastforward-icon.png"
					alt="Fast Forward"
					title="Fast Forward"
					width={50}
					height={0}
					style={{ height: "auto" }}
					onClick={() => {
						// setForwarding(true);
						// setBackwarding(false);
					}}
				/>
			</div>
		</>
	);
}
