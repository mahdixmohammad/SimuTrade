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
	const reference = useRef<any>(null); // getting a reference of the canvas (graph element)
	const canvasSize = useRef<any>(null); // getting a reference of the canvas (graph element)
	const [fastforwarding, setForwarding] = useState(false);
	const [fastBackwarding, setBackwarding] = useState(false);

	const handleAdd = useCallback(() => {
		function getRandomInt(min: number, max: number) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
		const randomBodySize = getRandomInt(50, 400);
		const randomTopWickSize = getRandomInt(0, 120);
		const randomBottomWickSize = getRandomInt(0, 120);
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
				yPosition +=
					prev + oldTopWick - randomTopWickSize - randomBodySize;
				if (colors.get(count - 1) == "red")
					yPosition += randomBodySize + (oldBody - randomBodySize);
			} else {
				yPosition += prev + oldTopWick - randomTopWickSize + oldBody;
				if (colors.get(count - 1) == "green") yPosition -= oldBody;
			}
			if (color === "green") {
				setOffset(offset + randomBodySize);
			}
		}
		// scroll to position where new candle was created
		reference.current.scrollTo(
			reference.current.scrollWidth,
			yPosition + offset
		);
		setColors(prevMap => new Map(prevMap.set(count, color)));
		setBodies(prevMap => new Map(prevMap.set(count, randomBodySize)));
		setTopWicks(prevMap => new Map(prevMap.set(count, randomTopWickSize)));
		setBottomWicks(
			prevMap => new Map(prevMap.set(count, randomBottomWickSize))
		);
		setPositions(prevMap => new Map(prevMap.set(count, yPosition)));
		setCount(count + 1);
		setVal([...val, undefined]);
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
	}, [
		val,
		count,
		colors,
		bodySizes,
		topwickSizes,
		bottomwickSizes,
		positions,
	]);

	useEffect(() => {
		let startX: number;
		let startY: number;
		let scrollTop: number;
		let scrollLeft: number;
		let isDown: boolean;

		const scrollThreshold = 3000; // Adjust as needed
		let currentCanvasHeight = 600;

		const handleScroll = (e: any) => {
			e.preventDefault();
			const zoomStep = 0.05;
			const currentZoom = parseFloat(reference.current.style.zoom || "1");
			const newZoom =
				e.deltaY > 0 ? currentZoom - zoomStep : currentZoom + zoomStep;

			// Limit zoom range (minimum 20%, maximum 200%)
			const minZoom = 0.1;
			const maxZoom = 2.0;
			const clampedZoom = Math.min(Math.max(newZoom, minZoom), maxZoom);

			// Update zoom
			reference.current.style.zoom = clampedZoom.toString();

			// Update height proportionally
			const baseHeight = 600; // Your base height value
			const newHeight = baseHeight * (1 / clampedZoom);

			// Apply the new height to your chart container
			reference.current.style.height = `${newHeight}px`;

			// Apply the new margin
			reference.current.style.marginTop = `${0}px`;
			reference.current.style.marginBottom = `${0}px`;
		};

		reference.current.addEventListener("wheel", handleScroll);
		reference.current.addEventListener("mouseenter", () => {
			let x = window.scrollX;
			let y = window.scrollY;
			window.onscroll = function () {
				window.scrollTo(x, y);
			};
		});
		reference.current.addEventListener("mouseleave", () => {
			window.onscroll = function () {};
		});

		reference.current.addEventListener("mousedown", (e: any) => {
			e.preventDefault();
			isDown = true;
			startX = e.pageX - reference.current.offsetLeft;
			startY = e.pageY - reference.current.offsetTop;
			scrollLeft = reference.current.scrollLeft;
			scrollTop = reference.current.scrollTop;
		});
		reference.current.addEventListener("mouseup", () => (isDown = false));
		reference.current.addEventListener(
			"mouseleave",
			() => (isDown = false)
		);
		reference.current.addEventListener("mousemove", (e: any) => {
			if (isDown) {
				const x = e.pageX - reference.current.offsetLeft;
				const y = e.pageY - reference.current.offsetTop;
				const walkX = (x - startX) * 5;
				const walkY = (y - startY) * 5;
				reference.current.scrollLeft = scrollLeft - walkX;
				reference.current.scrollTop = scrollTop - walkY;
			}

			const totalHeight = reference.current.scrollHeight;

			if (
				scrollTop + window.innerHeight >=
				totalHeight - scrollThreshold
			) {
				// User has scrolled to the bottom
				currentCanvasHeight += 100;
				canvasSize.current.style.height = `${currentCanvasHeight}px`;
			}
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
			reference.current.removeEventListener("wheel", handleScroll);
		};
	}, [fastforwarding, fastBackwarding, handleAdd, handleDelete]);

	return (
		<main className="min-h-screen max-w-screen py-1 bg-black text-center">
			<h1 className="text-white text-5xl font-black my-10">SimuTrade</h1>
			<div
				ref={reference}
				className="top-8 left-0 flex bg-white h-[600px] w-11/12 overflow-auto my-8 mx-auto px-96 scrollbar-hide"
			>
				<div ref={canvasSize}></div>
				{val.map((_: any, i: any) => {
					return (
						<Candlestick
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
			<div className="flex justify-center items-center gap-6 mx-auto bg-gray-900 w-[500px] h-24 my-8 rounded-2xl border-2 border-gray-600">
				<Image
					className="mx-8 cursor-pointer"
					src="/fastbackward-icon.png"
					alt="Fast Backward"
					title="Fast Backward"
					width={60}
					height={50}
					onClick={() => {
						setForwarding(false);
						setBackwarding(true);
					}}
				></Image>
				<Image
					className="cursor-pointer"
					src="/backward-icon.png"
					alt="Backward"
					title="Backward"
					width={43.75}
					height={50}
					onClick={handleDelete}
				></Image>
				{fastforwarding || fastBackwarding ? (
					<Image
						className="cursor-pointer"
						src="/pause-icon.png"
						alt="Pause"
						title="Pause"
						width={43.75}
						height={50}
						onClick={() => {
							setForwarding(false);
							setBackwarding(false);
						}}
					></Image>
				) : (
					<Image
						className="cursor-pointer"
						src="/play-icon.png"
						alt="Play"
						title="Play"
						width={43.75}
						height={50}
					></Image>
				)}
				<Image
					className="cursor-pointer"
					src="/forward-icon.png"
					alt="Forward"
					title="Forward"
					width={43.75}
					height={50}
					onClick={handleAdd}
				></Image>
				<Image
					className="mx-8 cursor-pointer"
					src="/fastforward-icon.png"
					alt="Fast Forward"
					title="Fast Forward"
					width={60}
					height={50}
					onClick={() => {
						setForwarding(true);
						setBackwarding(false);
					}}
				></Image>
			</div>
		</main>
	);
}
