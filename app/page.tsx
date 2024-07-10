"use client";
import Candlestick from "@/components/Candlestick";
import React, { useState, useEffect, useRef } from "react";

export default function Home() {
	const [val, setVal] = useState<any[]>([]); // an array of candlesticks to be rendered on the screen
	const [count, setCount] = useState(0); // the number of candlesticks
	const [colors, setColors] = useState(new Map()); // a map of all candles and their respective colors
	const [bodySizes, setBodies] = useState(new Map()); // a map of all candles and their respective body sizes
	const [topwickSizes, setTopWicks] = useState(new Map()); // a map of all candles and their respective wick sizes
	const [bottomwickSizes, setBottomWicks] = useState(new Map()); // a map of all candles and their respective wick sizes
	const [positions, setPositions] = useState(new Map()); // a map of all candles and their respective positions
	const [offset, setOffset] = useState(0); // how much to offset each candle positioning by (so that everything is in view)
	const reference = useRef<any>(null); // getting a reference of the canvas (graph element)

	const handleAdd = () => {
		function getRandomInt(min: number, max: number) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		}
		const randomBodySize = getRandomInt(50, 300);
		const randomTopWickSize = getRandomInt(0, 80);
		const randomBottomWickSize = getRandomInt(0, 50);
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

			// if (color === "red") {
			// 	setOffset(offset - randomBodySize);
			// }
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
	};

	const handleDelete = () => {
		let newVal = [...val];
		newVal.splice(-1);
		setVal(newVal);
	};

	useEffect(() => {
		const handleScroll = (e: any) => {
			const zoomStep = 0.05; // Adjust this as needed
			const currentZoom = parseFloat(reference.current.style.zoom || "1");
			const newZoom =
				e.deltaY > 0 ? currentZoom - zoomStep : currentZoom + zoomStep;

			// Limit zoom range (minimum 5%, maximum 200%)
			const minZoom = 0.2;
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
		reference.current.addEventListener("mouseenter", (e: any) => {
			let x = window.scrollX;
			let y = window.scrollY;
			window.onscroll = function () {
				window.scrollTo(x, y);
			};
		});
		reference.current.addEventListener("mouseleave", (e: any) => {
			window.onscroll = function () {};
		});
	}, []);

	return (
		<main className="min-h-screen max-w-screen py-1 bg-black text-center">
			<h1 className="text-white text-5xl font-black my-10">SimuTrade</h1>
			<div
				ref={reference}
				className="top-8 left-0 flex bg-white h-[600px] w-11/12 overflow-auto my-8 mx-auto px-10"
			>
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
			<div className="flex justify-center gap-5 w-11/12 my-10 mx-auto box-border">
				<button
					className="candlestickButton bg-green-400"
					onClick={handleAdd}
				>
					Add
				</button>
				<button
					className="candlestickButton bg-red-400"
					onClick={handleDelete}
				>
					Delete
				</button>
			</div>
		</main>
	);
}
