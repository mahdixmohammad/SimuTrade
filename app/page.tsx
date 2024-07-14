"use client";
import Image from "next/image";
import Candlestick from "@/components/Candlestick";
import React, { useState, useEffect, useRef, useCallback } from "react";

export default function Home() {
	const [val, setVal] = useState<undefined[]>([]); // an array of candlesticks to be rendered on the screen
	const [count, setCount] = useState(0); // the number of candlesticks
	const [colors, setColors] = useState(new Map()); // a map of all candles and their respective colors
	const [bodySizes, setBodies] = useState(new Map()); // a map of all candles and their respective body sizes
	const [topwickSizes, setTopWicks] = useState(new Map()); // a map of all candles and their respective wick sizes
	const [bottomwickSizes, setBottomWicks] = useState(new Map()); // a map of all candles and their respective wick sizes
	const [positions, setPositions] = useState(new Map()); // a map of all candles and their respective positions
	const [offset, setOffset] = useState(0); // how much to offset each candle positioning by (so that everything is in view)
	const [fastforwarding, setForwarding] = useState(false);
	const [fastBackwarding, setBackwarding] = useState(false);
	const canvas = useRef<any>(null); // getting a reference of the canvas (graph element)
	const canvasSize = useRef<any>(null); // getting a reference of the canvasSize (creates scrolling space for the user)
	const verticalLine = useRef<any>(null); //
	const horizontalLine = useRef<any>(null);
	const xAxis = useRef<any>(null);
	const yAxis = useRef<any>(null);
	const candlestickRef = useRef(null);

	function getRandomDate(start: any, end: any) {
		return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
	}

	function getRandomInt(min: number, max: number) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	function getRandomNumber(min: number, max: number) {
		return Math.random() * (max - min) + min;
	}

	// initializing x-axis data
	const startDate = new Date(2012, 0, 1); // Replace with your desired start date
	const endDate = new Date(); // Replace with your desired end date (e.g., today)
	const randomDate = getRandomDate(startDate, endDate);

	const [initialDate, setInitialDate] = useState(randomDate);
	const [currentDate, setCurrentDate] = useState(startDate);

	// initializing y-axis data
	const [initialPrice, setInitialPrice] = useState(getRandomNumber(1, 10));
	const [currentPrice, setCurrentPrice] = useState(10);

	const handleAdd = useCallback(() => {
		// ensures that the window isn't getting scrolled as well
		let x = window.scrollX;
		let y = window.scrollY;
		window.onscroll = function () {
			window.scrollTo(x, y);
		};

		const randomBodySize = getRandomInt(50, 400);
		const randomTopWickSize = getRandomInt(0, 180);
		const randomBottomWickSize = getRandomInt(0, 180);
		const upOrDown = Math.floor(Math.random() * 2); // calculates an integer that is either 0 or 1
		const color = upOrDown ? "green" : "red";
		let yPosition = 0;
		if (count > 0) {
			// positioning:
			// {/* green candle: prev position + old top wick - new top wick - new body size */}
			// {/* red candle: prev position + old top wick - new top wick + old body size */}
			const prev = positions.get(count - 1);
			const oldTopWick = topwickSizes.get(count - 1);
			const oldBody = bodySizes.get(count - 1);
			if (upOrDown) {
				yPosition += prev + oldTopWick - randomTopWickSize - randomBodySize;
				if (colors.get(count - 1) == "red") yPosition += randomBodySize + (oldBody - randomBodySize);
			} else {
				yPosition += prev + oldTopWick - randomTopWickSize + oldBody;
				if (colors.get(count - 1) == "green") yPosition -= oldBody;
			}
			if (color === "green") {
				setOffset(offset + randomBodySize);
			}
		}
		setColors(prevMap => new Map(prevMap.set(count, color)));
		setBodies(prevMap => new Map(prevMap.set(count, randomBodySize)));
		setTopWicks(prevMap => new Map(prevMap.set(count, randomTopWickSize)));
		setBottomWicks(prevMap => new Map(prevMap.set(count, randomBottomWickSize)));
		setPositions(prevMap => new Map(prevMap.set(count, yPosition)));
		setCount(count + 1);
		setVal([...val, undefined]);
		// wait for candle to render before allowing window to be scrolled again
		setTimeout(() => {
			window.onscroll = function () {};
		}, 0);
	}, [count, colors, offset, bodySizes, topwickSizes, positions, val]);

	const handleDelete = useCallback(() => {
		if (count > 0) {
			let newVal = [...val];
			newVal.pop();

			const newColors = new Map(colors);
			newColors.delete(count - 1);

			const newBodySizes = new Map(bodySizes);
			newBodySizes.delete(count - 1);

			const newTopWickSizes = new Map(topwickSizes);
			newTopWickSizes.delete(count - 1);

			const newBottomWickSizes = new Map(bottomwickSizes);
			newBottomWickSizes.delete(count - 1);

			const newPositions = new Map(positions);
			newPositions.delete(count - 1);

			setVal(newVal);
			setCount(count - 1);
			setColors(newColors);
			setBodies(newBodySizes);
			setTopWicks(newTopWickSizes);
			setBottomWicks(newBottomWickSizes);
			setPositions(newPositions);
		} else {
			setBackwarding(false);
		}
	}, [val, count, colors, bodySizes, topwickSizes, bottomwickSizes, positions]);

	const handleBuy = (e: any) => {};

	useEffect(() => {
		let startX: number;
		let startY: number;
		let scrollTop: number;
		let scrollLeft: number;
		let isDown: boolean;

		let scrollThreshold = 600; // Adjust as needed
		let currentCanvasHeight = 600;

		const handleScroll = (e: any) => {
			e.preventDefault();
			const zoomStep = 0.05;
			const currentZoom = parseFloat(canvas.current.style.zoom || "1");
			const newZoom = e.deltaY > 0 ? currentZoom - zoomStep : currentZoom + zoomStep;

			// Limit zoom range (minimum 20%, maximum 200%)
			const minZoom = 0.1;
			const maxZoom = 2.0;
			const clampedZoom = Math.min(Math.max(newZoom, minZoom), maxZoom);

			// Update zoom
			canvas.current.style.zoom = clampedZoom.toString();

			// Update height proportionally
			const baseHeight = 600; // Your base height value
			const newHeight = baseHeight * (1 / clampedZoom);
			scrollThreshold = newHeight;

			// Apply the new height to your chart container
			canvas.current.style.height = `${newHeight}px`;

			// Apply the new margin
			canvas.current.style.marginTop = `${0}px`;
			canvas.current.style.marginBottom = `${0}px`;
		};
		const handleMouseMove = (e: any) => {
			// Update vertical and horizontal lines
			const currentZoom = parseFloat(canvas.current.style.zoom || "1");

			const canvasWidth = canvas.current.offsetWidth / (1 / currentZoom);
			horizontalLine.current.style.width = `${canvasWidth}px`;
			const canvasLeft = canvas.current.getBoundingClientRect().left / (1 / currentZoom);
			horizontalLine.current.style.left = `${canvasLeft}px`;

			const canvasHeight = canvas.current.offsetheight / (1 / currentZoom);
			verticalLine.current.style.height = `${canvasHeight}px`;
			const canvasTop = canvas.current.getBoundingClientRect().top / (1 / currentZoom) + window.scrollY;
			verticalLine.current.style.top = `${canvasTop}px`;

			// Update vertical and horizontal lines to follow user's cursor in the window
			const xPosition = e.pageX;
			verticalLine.current.style.left = `${xPosition}px`;
			const yPosition = e.pageY;
			horizontalLine.current.style.top = `${yPosition}px`;

			// Calculate the x-position of the cursor on the canvas
			let cursorXPosition =
				e.pageX - canvas.current.getBoundingClientRect().left * currentZoom + canvas.current.scrollLeft * currentZoom + offset;
			// Ensures that it cannot be less than 0
			cursorXPosition = cursorXPosition < 0 ? 0 : cursorXPosition;
			let gridXPosition = Math.floor(cursorXPosition / (40 * currentZoom));
			// Calculate the new date value
			let newDateValue = initialDate.valueOf() + 864e5 * gridXPosition;

			// Convert the new date value to a Date object
			setCurrentDate(new Date(newDateValue));

			// Calculate the y-position of the cursor on the canvas
			let cursorYPosition: number =
				e.pageY -
				window.scrollY -
				canvas.current.getBoundingClientRect().top * currentZoom +
				canvas.current.scrollTop * currentZoom -
				offset * currentZoom;

			let newPriceValue: number = Math.exp((10000 - cursorYPosition / currentZoom) / 10000 + initialPrice);

			setCurrentPrice(newPriceValue);

			// Prevent the x-axis div from overflowing off the canvas
			if (verticalLine.current.getBoundingClientRect().left <= canvas.current.getBoundingClientRect().left * currentZoom + 46) {
				let xAxisLeft = canvas.current.getBoundingClientRect().left * currentZoom - 2 - verticalLine.current.getBoundingClientRect().left;
				xAxis.current.style.left = `${xAxisLeft}px`;
			} else if (verticalLine.current.getBoundingClientRect().right >= canvas.current.getBoundingClientRect().right * currentZoom - 46) {
				let xAxisRight = verticalLine.current.getBoundingClientRect().right - canvas.current.getBoundingClientRect().right * currentZoom;
				xAxis.current.style.right = `${xAxisRight}px`;
				xAxis.current.style.left = `initial`;
			} else xAxis.current.style.left = `-48px`;

			// Prevent the y-axis div from overflowing off the canvas
			if (horizontalLine.current.getBoundingClientRect().top <= canvas.current.getBoundingClientRect().top * currentZoom + 20) {
				let yAxisTop = canvas.current.getBoundingClientRect().top * currentZoom - 2 - horizontalLine.current.getBoundingClientRect().top;
				yAxis.current.style.top = `${yAxisTop}px`;
			} else if (horizontalLine.current.getBoundingClientRect().bottom >= canvas.current.getBoundingClientRect().bottom * currentZoom - 72) {
				let yAxisBottom =
					horizontalLine.current.getBoundingClientRect().bottom - canvas.current.getBoundingClientRect().bottom * currentZoom + 48;
				yAxis.current.style.bottom = `${yAxisBottom}px`;
				yAxis.current.style.top = `initial`;
			} else yAxis.current.style.top = `-24px`;
		};

		canvas.current.addEventListener("wheel", handleScroll);
		canvas.current.addEventListener("mouseenter", (e: any) => {
			let x = window.scrollX;
			let y = window.scrollY;
			window.onscroll = function () {
				window.scrollTo(x, y);
			};
			horizontalLine.current.style.display = "block";
			verticalLine.current.style.display = "block";
			handleMouseMove(e);
		});

		canvas.current.addEventListener("mouseleave", () => {
			window.onscroll = function () {};
			horizontalLine.current.style.display = "none";
			verticalLine.current.style.display = "none";
		});

		canvas.current.addEventListener("mousedown", (e: any) => {
			e.preventDefault();
			isDown = true;
			startX = e.pageX - canvas.current.offsetLeft;
			startY = e.pageY - canvas.current.offsetTop;
			scrollLeft = canvas.current.scrollLeft;
			scrollTop = canvas.current.scrollTop;
		});
		canvas.current.addEventListener("mouseup", () => (isDown = false));
		canvas.current.addEventListener("mouseleave", () => (isDown = false));
		canvas.current.addEventListener("mousemove", (e: any) => {
			if (isDown) {
				const x = e.pageX - canvas.current.offsetLeft;
				const y = e.pageY - canvas.current.offsetTop;
				const walkX = (x - startX) * 5;
				const walkY = (y - startY) * 5;
				canvas.current.scrollLeft = scrollLeft - walkX;
				canvas.current.scrollTop = scrollTop - walkY;
			}

			const totalHeight = canvas.current.scrollHeight;

			// add more space to the bottom of the canvas (by increasing the height of a special div)
			if (scrollTop + window.innerHeight >= totalHeight - scrollThreshold) {
				currentCanvasHeight += 100;
				canvasSize.current.style.height = `${currentCanvasHeight}px`;
			}
			// add more space to the top of the canvas (offsetting each candle's position)
			if (scrollTop <= 100) {
				setOffset(offset + 300);
			}
			handleMouseMove(e);
		});

		let addTimer: any;
		if (fastforwarding) {
			addTimer = setInterval(handleAdd, 500);
		}

		let deleteTimer: any;
		if (fastBackwarding) {
			deleteTimer = setInterval(handleDelete, 500);
		}

		return () => {
			clearInterval(addTimer); // Cleanup: clear the interval when component unmounts
			clearInterval(deleteTimer); // Cleanup: clear the interval when component unmounts
			canvas.current.removeEventListener("wheel", handleScroll);
			canvas.current.removeEventListener("mousemove", handleMouseMove);
		};
	}, [initialDate, initialPrice, offset, fastforwarding, fastBackwarding, handleAdd, handleDelete]);

	return (
		<main className="min-h-screen max-w-screen py-1 bg-black text-center font-custom">
			<h1 className="text-white text-5xl font-medium my-10">SimuTrade</h1>
			{/* Vertical and Horizontal crosshairs on canvas */}
			<div
				ref={verticalLine}
				className="z-50 absolute h-[600px] top-[132px] border-l-2 border-dotted border-white pointer-events-none"
				style={{ display: "none" }}
			>
				<div ref={xAxis} className="z-40 absolute h-12 w-24 bottom-0 left-[-48px] bg-gray-500 flex justify-center items-center text-white">
					{currentDate.toDateString()}
				</div>
			</div>
			<div
				ref={horizontalLine}
				className="z-40 absolute w-[995px] left-[46px] border-t-2 border-dotted border-white pointer-events-none"
				style={{ display: "none" }}
			>
				<div ref={yAxis} className="z-40 absolute h-12 w-24 top-[-24px] right-0 bg-gray-500 flex justify-center items-center text-white">
					{currentPrice.toFixed(2)}
				</div>
			</div>
			{/* <button className="z-50 w-24 h-9 bg-green-500 rounded-lg absolute text-white font-bold mt-4 left-20" onClick={handleBuy}>
				BUY
			</button> */}
			<div
				ref={canvas}
				className="top-8 left-0 flex bg-gray-900 h-[600px] w-11/12 overflow-auto my-8 mx-auto scrollbar-hide cursor-crosshair border-2 border-white"
			>
				<div ref={canvasSize}></div>

				{val.map((_: any, i: any) => {
					return (
						<Candlestick
							ref={candlestickRef}
							color={colors.get(i)}
							bodySize={bodySizes.get(i)}
							topwickSize={topwickSizes.get(i)}
							bottomwickSize={bottomwickSizes.get(i)}
							xPosition={i}
							yPosition={positions.get(i) + offset}
							key={i}
						/>
					);
				})}
			</div>
			<div className="flex justify-center items-center gap-4 md:gap-6 mx-auto bg-gray-900 w-10/12 sm:w-2/4 md:w-[450px] h-20 my-8 rounded-2xl border-2 border-white">
				<Image
					className="w-10 md:w-[50px] mx-4 md:mx-8  cursor-pointer"
					src="/fastbackward-icon.png"
					alt="Fast Backward"
					title="Fast Backward"
					width={50}
					height={0}
					style={{ height: "auto" }}
					onClick={() => {
						setForwarding(false);
						setBackwarding(true);
					}}
				></Image>
				<Image
					className="w-7 md:w-[35px] cursor-pointer"
					src="/backward-icon.png"
					alt="Backward"
					title="Backward"
					width={35}
					height={0}
					style={{ height: "auto" }}
					onClick={handleDelete}
				></Image>
				{fastforwarding || fastBackwarding ? (
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
					></Image>
				) : (
					<Image
						className="w-7 md:w-[35px] cursor-pointer"
						src="/play-icon.png"
						alt="Play"
						title="Play"
						width={35}
						height={0}
						style={{ height: "auto" }}
					></Image>
				)}
				<Image
					className="w-7 md:w-[35px] cursor-pointer"
					src="/forward-icon.png"
					alt="Forward"
					title="Forward"
					width={35}
					height={0}
					style={{ height: "auto" }}
					onClick={handleAdd}
				></Image>
				<Image
					className="w-10 md:w-[50px] mx-4 md:mx-8 cursor-pointer"
					src="/fastforward-icon.png"
					alt="Fast Forward"
					title="Fast Forward"
					width={50}
					height={0}
					style={{ height: "auto" }}
					onClick={() => {
						setForwarding(true);
						setBackwarding(false);
					}}
				></Image>
			</div>
		</main>
	);
}
