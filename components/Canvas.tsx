"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Controls from "./Controls";
import { updateUserDashboard } from "@/actions/action";

export default function Canvas() {
	// set React DOM references
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const contextRef = useRef<CanvasRenderingContext2D | null>(null);
	const horizontalLineRef = useRef<HTMLDivElement | null>(null);
	const verticalLineRef = useRef<HTMLDivElement | null>(null);
	const xAxisRef = useRef<HTMLDivElement | null>(null);
	const yAxisRef = useRef<HTMLDivElement | null>(null);

	const tradeButtonsRef = useRef<HTMLDivElement | null>(null);
	const tradeSizeRef = useRef<HTMLInputElement | null>(null);
	const tradeLineRef = useRef<HTMLDivElement | null>(null);

	const initializeTPButton = useRef<HTMLDivElement | null>(null);
	const tpLineRef = useRef<HTMLDivElement | null>(null);
	const tpLineMarkerRef = useRef<HTMLDivElement | null>(null);

	const initializeSLButton = useRef<HTMLDivElement | null>(null);
	const slLineRef = useRef<HTMLDivElement | null>(null);
	const slLineMarkerRef = useRef<HTMLDivElement | null>(null);

	// returns a random integer between min and max (both inclusive)
	function getRandomInt(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	// returns a random float between min and max (both inclusive)
	function getRandomFloat(min: number, max: number): number {
		return Math.random() * (max - min) + min;
	}

	const yToPrice = (y: number): number => {
		return Math.exp(-y / 10000);
	};

	const priceToY = (price: number): number => {
		return Math.log(price) * -10000;
	};

	interface Candlestick {
		date: Date;
		color: string;
		openingPrice: number;
		closingPrice: number;
		highPrice: number;
		lowPrice: number;
	}

	// initializes state of application
	const [initialPrice, setInitialPrice] = useState(getRandomFloat(50, 1000));
	const [openingPrice, setOpeningPrice] = useState(initialPrice);
	const [data, setData] = useState<Record<string, Candlestick>>({});
	const [count, setCount] = useState(0);
	const [fastForwarding, setForwarding] = useState(false);
	const [fastBackwarding, setBackwarding] = useState(false);

	// state of canvas
	const [scale, setScale] = useState(0.5);
	const [isPanning, setIsPanning] = useState(false);
	const [panOffset, setPanOffset] = useState({ x: 500, y: -priceToY(openingPrice + openingPrice / 15) });
	const [lastPanPosition, setLastPanPosition] = useState({ x: 0, y: 0 });

	// state of trade
	const [tradeStartDate, setTradeStart] = useState(new Date());
	const [tradePrice, setTradePrice] = useState(-1);
	const [tradeType, setTradeType] = useState("");
	const [tradePNL, setTradePNL] = useState(0);
	const [tradeSize, setTradeSize] = useState(1);

	// state of TP
	const [tpActive, setTpActive] = useState(false);
	const [tpDragging, setTpDragging] = useState(false);
	const [tpPrevPosition, setTpPrevPosition] = useState(0);
	const [tpOffset, setTpOffset] = useState(0);
	const [tpPrice, setTpPrice] = useState(-1);
	const [tpPNL, setTpPNL] = useState(-1);

	// state of SL
	const [slActive, setSlActive] = useState(false);
	const [slDragging, setSlDragging] = useState(false);
	const [slPrevPosition, setSlPrevPosition] = useState(0);
	const [slOffset, setSlOffset] = useState(0);
	const [slPrice, setSlPrice] = useState(-1);
	const [slPNL, setSlPNL] = useState(-1);

	function getRandomDate(start: any, end: any) {
		return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
	}

	// initializing x-axis data
	const startDate = new Date(2012, 0, 1); // Replace with your desired start date
	const endDate = new Date(); // Replace with your desired end date (e.g., today)
	const randomDate = getRandomDate(startDate, endDate);

	const [initialDate, setInitialDate] = useState(randomDate);
	const [currentDate, setCurrentDate] = useState(startDate);

	// initializing y-axis data
	const [currentPrice, setCurrentPrice] = useState(0);

	const drawCandlestick = useCallback(
		(candlestick: Candlestick, index: number) => {
			const c = contextRef.current!;
			const x: number = index * 20;

			const openingY = priceToY(candlestick.openingPrice);
			const closingY = priceToY(candlestick.closingPrice);
			const bodyHeight = Math.abs(closingY - openingY);
			const topWickHeight = priceToY(candlestick.highPrice);
			const bottomWickHeight = priceToY(candlestick.lowPrice);

			if (candlestick.color === "green") {
				// creates the candlestick body
				c.fillStyle = "rgb(0, 167, 114)";
				c.fillRect(x, openingY, 20, -bodyHeight);

				// creates the candlestick wicks
				c.strokeStyle = "rgb(0, 167, 114)";
				c.lineWidth = 3.5 / (scale * 2.5);
				c.beginPath();
				// moves the line in between the candlestick body at its top
				c.moveTo(x + 10, closingY);
				// draws the top wick
				c.lineTo(x + 10, topWickHeight);
				// moves the line in between the candlestick body at its bottom
				c.moveTo(x + 10, openingY);
				// draws the bottom wick
				c.lineTo(x + 10, bottomWickHeight);
				c.stroke();
			} else {
				// creates the candlestick body
				c.fillStyle = "rgb(255, 50, 50)";
				c.fillRect(x, openingY, 20, bodyHeight);

				c.strokeStyle = "rgb(255, 50, 50)";
				c.lineWidth = 3.5 / (scale * 2.5);
				// creates the candlestick wicks
				c.beginPath();
				// moves the line in between the candlestick body at its top
				c.moveTo(x + 10, openingY);
				// draws the top wick
				c.lineTo(x + 10, topWickHeight);
				// moves the line in between the candlestick body at its bottom
				c.moveTo(x + 10, closingY);
				// draws the bottom wick
				c.lineTo(x + 10, bottomWickHeight);
				c.stroke();
			}
		},
		[scale]
	);

	const drawTrade = useCallback(() => {
		const canvas = canvasRef.current!;
		const tradeLine = tradeLineRef.current!;
		const tpLine = tpLineRef.current!;
		const slLine = slLineRef.current!;

		if (tradePrice >= 0 && count > 0) {
			tradeLine.style.display = "block";
			const tradeLineTop = canvasRef.current!.getBoundingClientRect().top + window.scrollY + (priceToY(tradePrice) + panOffset.y) * scale;
			tradeLine.style.top = `${tradeLineTop}px`;

			if (tpActive) {
				tpLine.style.visibility = "visible";
			}

			if (slActive) {
				slLine.style.visibility = "visible";
			}

			const tpLineTop =
				canvasRef.current!.getBoundingClientRect().top + window.scrollY + (priceToY(tradePrice) + panOffset.y + tpOffset) * scale;
			tpLine.style.top = `${tpLineTop}px`;
			setTpPrice(yToPrice((tpLineTop - window.scrollY - canvasRef.current!.getBoundingClientRect().top) / scale - panOffset.y));

			const slLineTop =
				canvasRef.current!.getBoundingClientRect().top + window.scrollY + (priceToY(tradePrice) + panOffset.y + slOffset) * scale;
			slLine.style.top = `${slLineTop}px`;
			setSlPrice(yToPrice((slLineTop - window.scrollY - canvasRef.current!.getBoundingClientRect().top) / scale - panOffset.y));

			const tpPNL = tradeType === "long" ? tradeSize * (tpPrice - tradePrice) : tradeSize * (tradePrice - tpPrice);
			if (tpPNL > 0) tpLine.style.color = "rgb(0, 167, 114)";
			else if (tpPNL < 0) tpLine.style.color = "rgb(255, 50, 50)";
			else tpLine.style.color = "white";
			setTpPNL(tpPNL);

			const slPNL = tradeType === "long" ? tradeSize * (slPrice - tradePrice) : tradeSize * (tradePrice - slPrice);
			if (slPNL > 0) slLine.style.color = "rgb(0, 167, 114)";
			else if (slPNL < 0) slLine.style.color = "rgb(255, 50, 50)";
			else slLine.style.color = "white";
			setSlPNL(slPNL);

			const pnl =
				tradeType === "long" ? tradeSize * (data[count].closingPrice - tradePrice) : tradeSize * (tradePrice - data[count].closingPrice);
			if (pnl > 0) tradeLine.style.color = "rgb(0, 167, 114)";
			else if (pnl < 0) tradeLine.style.color = "rgb(255, 50, 50)";
			else tradeLine.style.color = "white";
			setTradePNL(pnl);
		}
		// Prevents tradeLine from overflowing off the canvas
		if (tradeLine.getBoundingClientRect().top <= canvas.getBoundingClientRect().top) {
			tradeLine.style.display = "none";
		} else if (tradeLine.getBoundingClientRect().bottom >= canvas.getBoundingClientRect().bottom) {
			tradeLine.style.display = "none";
		}

		// Prevents tpLine from overflowing off the canvas
		if (tpLine.getBoundingClientRect().top <= canvas.getBoundingClientRect().top) {
			tpLine.style.top = `${canvas.getBoundingClientRect().top}px`;
			tpLine.style.visibility = "hidden";
		} else if (tpLine.getBoundingClientRect().bottom >= canvas.getBoundingClientRect().bottom) {
			tpLine.style.top = `${canvas.getBoundingClientRect().top}px`;
			tpLine.style.visibility = "hidden";
		}

		// Prevents slLine from overflowing off the canvas
		if (slLine.getBoundingClientRect().top <= canvas.getBoundingClientRect().top) {
			slLine.style.top = `${canvas.getBoundingClientRect().top}px`;
			slLine.style.visibility = "hidden";
		} else if (slLine.getBoundingClientRect().bottom >= canvas.getBoundingClientRect().bottom) {
			slLine.style.top = `${canvas.getBoundingClientRect().top}px`;
			slLine.style.visibility = "hidden";
		}
	}, [count, data, scale, panOffset, tradeType, tradePrice, tradeSize, tpOffset, tpActive, tpPrice, slOffset, slActive, slPrice]); //scale, panOffset, tradePrice

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
			drawTrade();
			c.restore();
		},
		[data, drawCandlestick, drawTrade]
	);

	const removeTP = useCallback(() => {
		if (tpDragging) {
			canvasRef.current!.style.cursor = "crosshair";
			tpLineRef.current!.style.cursor = "pointer";
			setTpDragging(false);
		}
		initializeTPButton.current!.style.display = "block";
		tpLineRef.current!.style.visibility = "hidden";
		setTpActive(false);
		setTpPrice(-1);
	}, [tpDragging]);

	const removeSL = useCallback(() => {
		if (slDragging) {
			canvasRef.current!.style.cursor = "crosshair";
			slLineRef.current!.style.cursor = "pointer";
			setSlDragging(false);
		}
		initializeSLButton.current!.style.display = "block";
		slLineRef.current!.style.visibility = "hidden";
		setSlActive(false);
		setSlPrice(-1);
	}, [slDragging]);

	const endTrade = useCallback(
		(finalPNL: number) => {
			// reset trade state to default
			tradeLineRef.current!.style.display = "none";
			// update user's dashboard in database
			updateUserDashboard(finalPNL, tradeSize, tradeStartDate.getTime(), data[count].date.getTime());
			removeTP();
			removeSL();
			setTradePrice(-1);
			setTradeType("");
			setTradePNL(0);
			setTradeSize(1);
		},
		[count, data, removeSL, removeTP, tradeSize, tradeStartDate]
	);

	const handleAdd = useCallback(() => {
		// adds a day to each candlestick
		const date = new Date(initialDate.valueOf() + 864e5 * count);
		// randomly picks either 0 or 1 (0 -> red, 1 -> green)
		const random = getRandomInt(0, 1);
		// destructures the array mapped to 0 or 1
		const color = random === 0 ? "red" : "green";

		// randomly pick the sizes of the candlestick body and wicks
		const bodyHeight = getRandomFloat(25, 300);
		const topWickHeight = getRandomFloat(0, 200);
		const bottomWickHeight = getRandomFloat(0, 200);
		const openingPriceY = priceToY(openingPrice);

		// Convert y-coordinates back to prices
		let closingPriceY: number;
		let closingPrice: number;
		let highPrice: number;
		let lowPrice: number;

		if (color === "green") {
			closingPriceY = openingPriceY - bodyHeight;
			highPrice = yToPrice(closingPriceY - topWickHeight);
			lowPrice = yToPrice(openingPriceY + bottomWickHeight);
		} else {
			closingPriceY = openingPriceY + bodyHeight;
			highPrice = yToPrice(openingPriceY - topWickHeight);
			lowPrice = yToPrice(closingPriceY + bottomWickHeight);
		}

		closingPrice = yToPrice(closingPriceY);

		// hitting take profit
		if (tpActive && tradeType === "long" && highPrice >= tpPrice) {
			endTrade(tpPNL);
		} else if (tpActive && tradeType === "short" && lowPrice <= tpPrice) {
			endTrade(tpPNL);
		}

		// hitting stop loss
		if (slActive && tradeType === "long" && lowPrice <= slPrice) {
			endTrade(slPNL);
		} else if (slActive && tradeType === "short" && highPrice >= slPrice) {
			endTrade(slPNL);
		}

		// creates new entry for data
		let newCandlestick: Candlestick = {
			date: date,
			color: color,
			openingPrice: openingPrice,
			closingPrice: closingPrice,
			highPrice: highPrice,
			lowPrice: lowPrice,
		};

		tradeButtonsRef.current!.style.display = "flex";

		// sets new states
		setOpeningPrice(closingPrice);
		setData(prevData => ({
			...prevData,
			[count + 1]: newCandlestick,
		}));
		setCount(count + 1);
	}, [initialDate, count, openingPrice, tpActive, tradeType, tpPrice, slActive, slPrice, tpPNL, endTrade, slPNL]);

	const handleDelete = useCallback(() => {
		const c = contextRef.current!;
		if (count > 1) {
			c.clearRect((count - 1) * 20, 0, 20, canvasRef.current!.height);
			setOpeningPrice(data[count - 1].closingPrice);
			delete data[count];
			setData(data);
			setCount(count - 1);
		} else {
			c.clearRect(0, 0, 20, canvasRef.current!.height);
			setOpeningPrice(initialPrice);
			setData({});
			setCount(0);
			// removes trade and stops fastbackwarding
			endTrade(0);
			setBackwarding(false);
		}
	}, [count, data, endTrade, initialPrice]);

	// validates what the user is typing in
	const handleInput = () => {
		const tradeSize = tradeSizeRef.current!;
		if (!tradeSize.value || Number(tradeSize.value) > 999.9 || Number(tradeSize.value) < 0.1) {
			tradeSize.style.border = "3px solid red";
			tradeSize.style.background = "rgb(255, 195, 195)";
		} else {
			tradeSize.style.border = "0";
			tradeSize.style.background = "revert-layer";
		}
	};

	const toggleControls = () => {
		const playbackControls = document.querySelector(".playback-controls")!;
		playbackControls.classList.toggle("invisible");
		const hideControls = document.querySelector(".hide-controls")!;
		const arrow1 = document.querySelector(".hide-controls div:nth-child(1)")!;
		const arrow2 = document.querySelector(".hide-controls div:nth-child(2)")!;
		arrow1.classList.toggle("-rotate-[135deg]");
		arrow2.classList.toggle("rotate-[135deg]");
		arrow1.classList.toggle("rotate-[-225deg]");
		arrow2.classList.toggle("rotate-[225deg]");
		hideControls.classList.toggle("bottom-32");
		hideControls.classList.toggle("bottom-40");
	};

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
		const tpLine: HTMLDivElement = tpLineRef.current!;
		const slLine: HTMLDivElement = slLineRef.current!;

		// Utility to get touch position
		const getTouchPosition = (e: TouchEvent) => {
			const touch = e.touches[0];
			return { x: touch.clientX, y: touch.clientY };
		};

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

		const handlePanStart = (e: MouseEvent | TouchEvent) => {
			e.preventDefault();

			canvas.style.cursor = "grabbing";
			setIsPanning(true);
			const position = e instanceof MouseEvent ? { x: e.clientX, y: e.clientY } : getTouchPosition(e);
			setLastPanPosition(position);
		};

		const handlePanMove = (e: MouseEvent | TouchEvent) => {
			e.preventDefault();

			if (!isPanning) return;
			const position = e instanceof MouseEvent ? { x: e.clientX, y: e.clientY } : getTouchPosition(e);
			const deltaX = position.x - lastPanPosition.x;
			const deltaY = position.y - lastPanPosition.y;

			setPanOffset(prevOffset => ({
				x: prevOffset.x + deltaX / scale,
				y: prevOffset.y + deltaY / scale,
			}));
			setLastPanPosition(position);
		};

		const handlePanEnd = () => {
			if (!slDragging) canvas.style.cursor = "crosshair";
			setIsPanning(false);
		};

		// positions crosshairs to where the cursor moves
		const handleLineMove = (e: any) => {
			if (!slDragging) {
				horizontalLine.style.top = `${e.pageY}px`;
				verticalLine.style.left = `${e.pageX}px`;
				horizontalLine.style.display = "block";
				verticalLine.style.display = "block";

				// Calculate the price based on the y-coordinate
				const rect = canvas.getBoundingClientRect();
				const canvasYPosition = (e.pageY - window.scrollY - rect.top) / scale - panOffset.y;
				const price = yToPrice(canvasYPosition);

				setCurrentPrice(price);

				const canvasXPosition = (e.pageX - rect.left) / scale - panOffset.x;

				let gridXPosition = Math.floor(canvasXPosition / 20);
				// Calculate the new date value
				let newDateValue = initialDate.valueOf() + 864e5 * gridXPosition;

				// Convert the new date value to a Date object
				setCurrentDate(new Date(newDateValue));

				const xAxis = xAxisRef.current!;
				const yAxis = yAxisRef.current!;

				// Prevent the x-axis div from overflowing off the canvas
				if (verticalLine.getBoundingClientRect().left <= canvas.getBoundingClientRect().left + 46) {
					let xAxisLeft = canvas.getBoundingClientRect().left - 2 - verticalLine.getBoundingClientRect().left;
					xAxis.style.left = `${xAxisLeft}px`;
				} else if (verticalLine.getBoundingClientRect().right >= canvas.getBoundingClientRect().right - 46) {
					let xAxisRight = verticalLine.getBoundingClientRect().right - canvas.getBoundingClientRect().right;
					xAxis.style.right = `${xAxisRight}px`;
					xAxis.style.left = "initial";
				} else xAxis.style.left = "-48px";

				// Prevent the y-axis div from overflowing off the canvas
				if (horizontalLine.getBoundingClientRect().top <= canvas.getBoundingClientRect().top + 20) {
					let yAxisTop = canvas.getBoundingClientRect().top - 2 - horizontalLine.getBoundingClientRect().top;
					yAxis.style.top = `${yAxisTop}px`;
				} else if (horizontalLine.getBoundingClientRect().bottom >= canvas.getBoundingClientRect().bottom - 72) {
					let yAxisBottom = horizontalLine.getBoundingClientRect().bottom - canvas.getBoundingClientRect().bottom + 48;
					yAxis.style.bottom = `${yAxisBottom}px`;
					yAxis.style.top = "initial";
				} else yAxis.style.top = "-24px";
			}
		};

		// makes crosshairs invisible when users are not on the canvas
		const handleLineLeave = () => {
			horizontalLine.style.display = "none";
			verticalLine.style.display = "none";
		};

		const handleTPDragStart = (e: any) => {
			e.preventDefault();
			canvas.style.cursor = "grabbing";
			tpLine.style.cursor = "grabbing";
			setTpPrevPosition(tpLine.getBoundingClientRect().top);
			setTpDragging(true);
		};

		const handleTPMove = (e: MouseEvent) => {
			if (tpDragging) {
				tpLineMarkerRef.current!.style.display = "block";
				tpLineMarkerRef.current!.style.top = `${e.pageY}px`;
			}
			if (tpDragging && e.buttons !== 1) {
				tpLineMarkerRef.current!.style.display = "none";
				canvas.style.cursor = "crosshair";
				tpLine.style.cursor = "pointer";
				setTpOffset(tpOffset + (e.clientY - tpPrevPosition) / scale);
				setTpActive(true);
				setTpDragging(false);
			}
		};

		const handleSLDragStart = (e: any) => {
			e.preventDefault();
			canvas.style.cursor = "grabbing";
			slLine.style.cursor = "grabbing";
			setSlPrevPosition(slLine.getBoundingClientRect().top);
			setSlDragging(true);
		};

		const handleSLMove = (e: MouseEvent) => {
			if (slDragging) {
				slLineMarkerRef.current!.style.display = "block";
				slLineMarkerRef.current!.style.top = `${e.pageY}px`;
			}
			if (slDragging && e.buttons !== 1) {
				slLineMarkerRef.current!.style.display = "none";
				canvas.style.cursor = "crosshair";
				slLine.style.cursor = "pointer";
				setSlOffset(slOffset + (e.clientY - slPrevPosition) / scale);
				setSlActive(true);
				setSlDragging(false);
			}
		};

		// zoom and panning functionality
		canvas.addEventListener("wheel", handleZoom);
		canvas.addEventListener("mousedown", handlePanStart);
		canvas.addEventListener("mousemove", handlePanMove);
		canvas.addEventListener("mouseup", handlePanEnd);
		canvas.addEventListener("mouseleave", handlePanEnd);
		canvas.addEventListener("touchstart", handlePanStart);
		canvas.addEventListener("touchmove", handlePanMove);
		canvas.addEventListener("touchend", handlePanEnd);

		// crosshair functionality
		canvas.addEventListener("mousemove", handleLineMove);
		canvas.addEventListener("mouseleave", handleLineLeave);

		// drag take profit functionality
		tpLine.addEventListener("mousedown", handleTPDragStart);
		canvas.addEventListener("mousemove", handleTPMove);

		// drag stop loss functionality
		slLine.addEventListener("mousedown", handleSLDragStart);
		canvas.addEventListener("mousemove", handleSLMove);

		initializeTPButton.current!.addEventListener("mousedown", (e: MouseEvent) => {
			initializeTPButton.current!.style.display = "none";
			handleTPDragStart(e);
		});

		initializeSLButton.current!.addEventListener("mousedown", (e: MouseEvent) => {
			initializeSLButton.current!.style.display = "none";
			handleSLDragStart(e);
		});

		// cleanup
		return () => {
			canvas.removeEventListener("wheel", handleZoom);
			canvas.removeEventListener("mousedown", handlePanStart);
			canvas.removeEventListener("mousemove", handlePanMove);
			canvas.removeEventListener("mouseup", handlePanEnd);
			canvas.removeEventListener("mouseleave", handlePanEnd);
			canvas.removeEventListener("touchstart", handlePanStart);
			canvas.removeEventListener("touchmove", handlePanMove);
			canvas.removeEventListener("touchend", handlePanEnd);

			canvas.removeEventListener("mousemove", handleLineMove);
			canvas.removeEventListener("mouseleave", handleLineLeave);

			tpLine.removeEventListener("mousedown", handleTPDragStart);
			canvas.removeEventListener("mousemove", handleTPMove);

			slLine.removeEventListener("mousedown", handleSLDragStart);
			canvas.removeEventListener("mousemove", handleSLMove);
		};
	}, [
		openingPrice,
		data,
		initialDate,
		scale,
		isPanning,
		panOffset,
		lastPanPosition,
		tpDragging,
		tpPrevPosition,
		tpOffset,
		slDragging,
		slPrevPosition,
		slOffset,
	]);

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
		<div>
			<div ref={tradeButtonsRef} className="z-20 w-screen absolute lg:w-72 lg:ml-16 mt-20 h-12 hidden gap-3 justify-center items-center">
				<button
					className="w-24 h-9 bg-green-500 rounded-lg text-white font-bold left-16"
					onClick={() => {
						if (Number(tradeSizeRef.current!.value) >= 0.1 && Number(tradeSizeRef.current!.value) <= 999.9) {
							// positioning the TP arrow above the trade line
							const firstTPArrow: HTMLDivElement = initializeTPButton.current!.querySelector("div:nth-child(1)")!;
							const secondTPArrow: HTMLDivElement = initializeTPButton.current!.querySelector("div:nth-child(2)")!;
							firstTPArrow.style.top = "2px";
							firstTPArrow.style.bottom = "initial";
							firstTPArrow.style.left = "-28px";
							secondTPArrow.style.top = "2px";
							secondTPArrow.style.bottom = "initial";
							secondTPArrow.style.left = "-21px";

							// positioning the SL arrow below the trade line
							const firstSLArrow: HTMLDivElement = initializeSLButton.current!.querySelector("div:nth-child(1)")!;
							const secondSLArrow: HTMLDivElement = initializeSLButton.current!.querySelector("div:nth-child(2)")!;
							firstSLArrow.style.top = "initial";
							firstSLArrow.style.bottom = "2px";
							firstSLArrow.style.left = "-21px";
							secondSLArrow.style.top = "initial";
							secondSLArrow.style.bottom = "2px";
							secondSLArrow.style.left = "-28px";

							setTradeStart(data[count].date);
							setTradePrice(data[count].closingPrice);
							setTradeSize(Number(tradeSizeRef.current!.value));
							setTradeType("long");
						}
					}}
				>
					BUY
				</button>
				<input
					ref={tradeSizeRef}
					type="number"
					defaultValue={1}
					min={0.1}
					max={999.9}
					step={0.1}
					required
					className="w-14 h-9 text-center outline-0 bg-slate-200 font-bold"
					onKeyUp={handleInput}
				></input>
				<button
					className="w-24 h-9 bg-red-500 rounded-lg text-white font-bold left-44"
					onClick={() => {
						if (Number(tradeSizeRef.current!.value) >= 0.1 && Number(tradeSizeRef.current!.value) <= 999.9) {
							// positioning the TP arrow below the trade line
							const firstTPArrow: HTMLDivElement = initializeTPButton.current!.querySelector("div:nth-child(1)")!;
							const secondTPArrow: HTMLDivElement = initializeTPButton.current!.querySelector("div:nth-child(2)")!;
							firstTPArrow.style.top = "initial";
							firstTPArrow.style.bottom = "2px";
							firstTPArrow.style.left = "-21px";
							secondTPArrow.style.top = "initial";
							secondTPArrow.style.bottom = "2px";
							secondTPArrow.style.left = "-28px";

							// positioning the SL arrow above the trade line
							const firstSLArrow: HTMLDivElement = initializeSLButton.current!.querySelector("div:nth-child(1)")!;
							const secondSLArrow: HTMLDivElement = initializeSLButton.current!.querySelector("div:nth-child(2)")!;
							firstSLArrow.style.top = "2px";
							firstSLArrow.style.bottom = "initial";
							firstSLArrow.style.left = "-28px";
							secondSLArrow.style.top = "2px";
							secondSLArrow.style.bottom = "initial";
							secondSLArrow.style.left = "-21px";

							setTradePrice(data[count].closingPrice);
							setTradeSize(Number(tradeSizeRef.current!.value));
							setTradeType("short");
						}
					}}
				>
					SELL
				</button>
			</div>
			<div
				ref={tradeLineRef}
				className="z-10 absolute w-screen border-t-2 border-dotted border-yellow-500 pointer-events-none text-white"
				style={{ display: "none" }}
			>
				<div className="z-10 absolute h-6 w-24 top-[-12px] right-48 bg-black flex justify-center items-center border-2 border-yellow-500 cursor-pointer pointer-events-auto">
					{tradePNL.toFixed(2)}
					<div ref={initializeTPButton}>
						<div className="w-3 h-0.5 bg-green-500 -rotate-[45deg] absolute"></div>
						<div className="w-3 h-0.5 bg-green-500 rotate-[45deg] absolute"></div>
					</div>
					<div ref={initializeSLButton}>
						<div className="w-3 h-0.5 bg-red-500 -rotate-[45deg] absolute"></div>
						<div className="w-3 h-0.5 bg-red-500 rotate-[45deg] absolute"></div>
					</div>
					<div
						className="w-7 h-6 bg-gray-950 absolute right-[-28px] border-2 border-yellow-500 flex items-center justify-center"
						onClick={() => {
							endTrade(tradePNL);
							removeTP();
							removeSL();
						}}
					>
						<div className="w-5 h-0.5 bg-red-500 rotate-45 absolute"></div>
						<div className="w-5 h-0.5 bg-red-500 -rotate-45 absolute"></div>
					</div>
				</div>
			</div>
			<div
				ref={tpLineMarkerRef}
				className="z-10 absolute w-screen border-t-2 border-dotted border-green-500 opacity-50 pointer-events-none"
				style={{ display: "none" }}
			></div>
			<div
				ref={tpLineRef}
				className="z-10 absolute w-screen border-t-2 border-dotted border-green-500 cursor-pointer text-white"
				style={{ visibility: "hidden" }}
			>
				<div className="z-10 absolute h-6 w-24 top-[-12px] right-48 bg-black flex justify-center items-center border-2 border-green-500 cursor-pointer pointer-events-auto">
					{tpPNL.toFixed(2)}
					<div
						className="w-7 h-6 bg-gray-950 absolute right-[-28px] border-2 border-green-500 flex items-center justify-center"
						onClick={removeTP}
					>
						<div className="w-5 h-0.5 bg-red-500 rotate-45 absolute"></div>
						<div className="w-5 h-0.5 bg-red-500 -rotate-45 absolute"></div>
					</div>
				</div>
			</div>
			<div
				ref={slLineMarkerRef}
				className="z-10 absolute w-screen border-t-2 border-dotted border-red-500 opacity-50 pointer-events-none"
				style={{ display: "none" }}
			></div>
			<div
				ref={slLineRef}
				className="z-10 absolute w-screen border-t-2 border-dotted border-red-500 cursor-pointer text-white"
				style={{ visibility: "hidden" }}
			>
				<div className="z-10 absolute h-6 w-24 top-[-12px] right-48 bg-black flex justify-center items-center border-2 border-red-500 cursor-pointer pointer-events-auto">
					{slPNL.toFixed(2)}
					<div
						className="w-7 h-6 bg-gray-950 absolute right-[-28px] border-2 border-red-500 flex items-center justify-center"
						onClick={removeSL}
					>
						<div className="w-5 h-0.5 bg-red-500 rotate-45 absolute"></div>
						<div className="w-5 h-0.5 bg-red-500 -rotate-45 absolute"></div>
					</div>
				</div>
			</div>
			<div
				ref={horizontalLineRef}
				className="absolute w-screen border-t-2 border-dotted border-white pointer-events-none"
				style={{ display: "none", userSelect: "none" }}
			>
				<div ref={yAxisRef} className="z-10 absolute h-12 w-24 top-[-24px] right-0 bg-gray-500 flex justify-center items-center text-white">
					{currentPrice.toFixed(2)}
				</div>
			</div>
			<div
				ref={verticalLineRef}
				className="absolute h-screen border-l-2 border-dotted border-white pointer-events-none"
				style={{ display: "none", userSelect: "none" }}
			>
				<div ref={xAxisRef} className="z-10 absolute h-12 w-24 bottom-0 left-[-48px] bg-gray-500 flex justify-center items-center text-white">
					{currentDate.toDateString()}
				</div>
			</div>
			<canvas ref={canvasRef} className="w-screen h-screen bg-primary mx-auto cursor-crosshair"></canvas>
			<div
				className="hide-controls z-10 w-fit h-5 flex items-center justify-center absolute bottom-40 left-0 right-0 mx-auto mb-2 cursor-pointer duration-200"
				onClick={toggleControls}
			>
				<div className="w-5 h-0.5 bg-white relative left-1 -rotate-[135deg] duration-200"></div>
				<div className="w-5 h-0.5 bg-white relative right-1 rotate-[135deg] duration-200"></div>
			</div>
			<Controls
				handleAdd={handleAdd}
				handleDelete={handleDelete}
				fastForwarding={fastForwarding}
				fastBackwarding={fastBackwarding}
				setForwarding={setForwarding}
				setBackwarding={setBackwarding}
			/>
		</div>
	);
}
