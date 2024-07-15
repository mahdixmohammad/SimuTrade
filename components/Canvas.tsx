"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

export default function Canvas() {
	interface Candlestick {
		date: Date;
		color: string;
		openingPrice: number;
		closingPrice: number;
		topWickHeight: number;
		bodyHeight: number;
		bottomWickHeight: number;
	}

	// initializes state of application
	const [openingPrice, setOpeningPrice] = useState(300);
	const [data, setData] = useState<Record<string, Candlestick>>({});
	const [count, setCount] = useState(0);
	const [fastForwarding, setForwarding] = useState(false);
	const [fastBackwarding, setBackwarding] = useState(false);

	// state of canvas
	const [scale, setScale] = useState(1);
	const [isPanning, setIsPanning] = useState(false);
	const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
	const [lastPanPosition, setLastPanPosition] = useState({ x: 0, y: 0 });

	// set React DOM references
	const horizontalLineRef = useRef<HTMLDivElement | null>(null);
	const verticalLineRef = useRef<HTMLDivElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const contextRef = useRef<CanvasRenderingContext2D | null>(null);

	// returns a random integer between min and max (both inclusive)
	function getRandomInt(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	// returns a random float between min and max (both inclusive)
	function getRandomFloat(min: number, max: number): number {
		return Math.random() * (max - min) + min;
	}

	const drawCandlestick = useCallback((candlestick: Candlestick, index: number) => {
		const c = contextRef.current!;
		const x: number = index * 20;

		if (candlestick.color === "green") {
			// creates the candlestick body
			c.fillStyle = "rgb(0, 167, 114)";
			c.fillRect(x, candlestick.openingPrice, 20, -candlestick.bodyHeight);

			// creates the candlestick wicks
			c.strokeStyle = "rgb(0, 167, 114)";
			c.lineWidth = 2;
			c.beginPath();
			// moves the line in between the candlestick body at its top
			c.moveTo(x + 10, candlestick.closingPrice);
			// draws the top wick
			c.lineTo(x + 10, candlestick.closingPrice - candlestick.topWickHeight);
			// moves the line in between the candlestick body at its bottom
			c.moveTo(x + 10, candlestick.openingPrice);
			// draws the bottom wick
			c.lineTo(x + 10, candlestick.openingPrice + candlestick.bottomWickHeight);
			c.stroke();
		} else {
			// creates the candlestick body
			c.fillStyle = "rgb(255, 50, 50)";
			c.fillRect(x, candlestick.openingPrice, 20, candlestick.bodyHeight);

			c.strokeStyle = "rgb(255, 50, 50)";
			c.lineWidth = 2;
			// creates the candlestick wicks
			c.beginPath();
			// moves the line in between the candlestick body at its top
			c.moveTo(x + 10, candlestick.openingPrice);
			// draws the top wick
			c.lineTo(x + 10, candlestick.openingPrice - candlestick.topWickHeight);
			// moves the line in between the candlestick body at its bottom
			c.moveTo(x + 10, candlestick.closingPrice);
			// draws the bottom wick
			c.lineTo(x + 10, candlestick.closingPrice + candlestick.bottomWickHeight);
			c.stroke();
		}
	}, []);

	const redrawCanvas = useCallback(
		(newScale: number, panOffset: { x: number; y: number }) => {
			const c = contextRef.current!;
			c.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
			c.save();
			c.scale(newScale, newScale);
			c.translate(panOffset.x, panOffset.y);
			Object.keys(data).forEach(key => {
				const candlestick = data[key];
				drawCandlestick(candlestick, Number(key) - 1);
			});
			c.restore();
		},
		[data, drawCandlestick]
	);

	const handleAdd = useCallback(() => {
		// randomly picks either 0 or 1 (0 -> red, 1 -> green)
		const random = getRandomInt(0, 1);
		// destructures the array mapped to 0 or 1
		const color = random === 0 ? "red" : "green";

		// randomly pick the sizes of the candlestick body and wicks
		const bodyHeight = getRandomInt(25, 200);
		const topWickHeight = getRandomInt(0, 90);
		const bottomWickHeight = getRandomInt(0, 90);

		// green means negative y (candle goes up), red means positive y (candle goes down)
		let closingPrice: number = color === "green" ? openingPrice - bodyHeight : openingPrice + bodyHeight;

		// creates new entry for data
		let newCandlestick: Candlestick = {
			date: new Date(),
			color: color,
			openingPrice: openingPrice,
			closingPrice: closingPrice,
			topWickHeight: topWickHeight,
			bodyHeight: bodyHeight,
			bottomWickHeight: bottomWickHeight,
		};

		// sets new states
		setOpeningPrice(closingPrice);
		setData(prevData => ({
			...prevData,
			[count + 1]: newCandlestick,
		}));
		setCount(count + 1);
	}, [count, openingPrice]);

	const handleDelete = useCallback(() => {
		if (count > 0) {
			const c = contextRef.current!;
			c.clearRect((count - 1) * 20, 0, 20, canvasRef.current!.height);
			const newPrice = count > 1 ? data[count - 1]["closingPrice"] : 300;
			setOpeningPrice(newPrice);
			delete data[count];
			setData(data);
			setCount(count - 1);
		} else if (fastBackwarding) setBackwarding(false);
	}, [count, data, fastBackwarding]);

	// redraws the canvas anytime the state changes
	useEffect(() => {
		// uses setTimeout to ensure that variables load first
		setTimeout(() => {
			redrawCanvas(scale, panOffset);
		});
	});

	// initial render runs this function
	useEffect(() => {
		// initializes canvas
		const canvas: HTMLCanvasElement = canvasRef.current!;
		canvas.width = canvas.offsetWidth;
		canvas.height = canvas.offsetHeight;
		const c = canvas.getContext("2d")!;
		contextRef.current = c;
	}, []);

	// handles all functionality related to zooming and panning
	useEffect(() => {
		const canvas: HTMLCanvasElement = canvasRef.current!;
		const horizontalLine: HTMLDivElement = horizontalLineRef.current!;
		const verticalLine: HTMLDivElement = verticalLineRef.current!;

		const handleZoom = (event: WheelEvent) => {
			event.preventDefault();

			const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1;
			setScale(prevScale => {
				const newScale = prevScale * scaleFactor;
				// Define your minimum and maximum scale values
				const minScale = 0.1;
				const maxScale = 3;

				// Clamp the new scale value within the min and max values
				return Math.min(Math.max(newScale, minScale), maxScale);
			});
		};

		const handlePanStart = (event: MouseEvent) => {
			canvas.style.cursor = "grabbing";
			setIsPanning(true);
			setLastPanPosition({ x: event.clientX, y: event.clientY });
		};

		const handlePanMove = (event: MouseEvent) => {
			if (!isPanning) return;
			const deltaX = event.clientX - lastPanPosition.x;
			const deltaY = event.clientY - lastPanPosition.y;

			setPanOffset(prevOffset => ({
				x: prevOffset.x + deltaX / scale,
				y: prevOffset.y + deltaY / scale,
			}));
			setLastPanPosition({ x: event.clientX, y: event.clientY });
		};

		const handlePanEnd = () => {
			canvas.style.cursor = "crosshair";
			setIsPanning(false);
		};

		// positions crosshairs to where the cursor moves
		const handleLineMove = (e: any) => {
			const xPosition = e.pageX;
			const yPosition = e.pageY;
			horizontalLine.style.left = `${canvas.getBoundingClientRect().left}px`;
			horizontalLine.style.top = `${yPosition}px`;
			verticalLine.style.left = `${xPosition}px`;
			horizontalLine.style.display = "block";
			verticalLine.style.display = "block";
		};

		// makes crosshairs invisible when users are not on the canvas
		const handleLineLeave = () => {
			horizontalLine.style.display = "none";
			verticalLine.style.display = "none";
		};

		// zoom and panning functionality
		canvas.addEventListener("wheel", handleZoom);
		canvas.addEventListener("mousedown", handlePanStart);
		canvas.addEventListener("mousemove", handlePanMove);
		canvas.addEventListener("mouseup", handlePanEnd);
		canvas.addEventListener("mouseleave", handlePanEnd);

		// crosshair functionality
		canvas.addEventListener("mousemove", handleLineMove);
		canvas.addEventListener("mouseleave", handleLineLeave);

		// cleanup
		return () => {
			canvas.removeEventListener("wheel", handleZoom);
			canvas.removeEventListener("mousedown", handlePanStart);
			canvas.removeEventListener("mousemove", handlePanMove);
			canvas.removeEventListener("mouseup", handlePanEnd);
			canvas.removeEventListener("mouseleave", handlePanEnd);

			canvas.removeEventListener("mousemove", handleLineMove);
			canvas.removeEventListener("mouseleave", handleLineLeave);
		};
	}, [scale, isPanning, panOffset, lastPanPosition]);

	// runs anytime the state of fastForwarding / fasatBackwarding changes
	useEffect(() => {
		let addTimer: any;
		let deleteTimer: any;

		if (fastForwarding) {
			addTimer = setInterval(handleAdd, 250);
		} else if (fastBackwarding) {
			deleteTimer = setInterval(handleDelete, 250);
		}

		return () => {
			clearInterval(addTimer); // Cleanup: clear the interval when component unmounts
			clearInterval(deleteTimer); // Cleanup: clear the interval when component unmounts
		};
	}, [fastForwarding, fastBackwarding, handleAdd, handleDelete]);

	return (
		<>
			<div
				ref={horizontalLineRef}
				className="z-40 absolute w-11/12 left-[46px] border-t-2 border-dotted border-white pointer-events-none"
				style={{ display: "none" }}
			></div>
			<div
				ref={verticalLineRef}
				className="z-50 absolute h-[600px] top-[132px] border-l-2 border-dotted border-white pointer-events-none"
				style={{ display: "none" }}
			></div>
			<canvas ref={canvasRef} className="w-11/12 h-[600px] bg-gray-900 mx-auto border-2 border-white cursor-crosshair"></canvas>
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
						setForwarding(false);
						setBackwarding(true);
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
				{fastForwarding || fastBackwarding ? (
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
						setForwarding(true);
						setBackwarding(false);
					}}
				/>
			</div>
		</>
	);
}
