"use client";
import Candlestick from "@/components/Candlestick";
import React, { useState, useEffect } from "react";

export default function Home() {
	const [val, setVal] = useState<any>([]);
	const handleAdd = () => {
		setVal([...val, undefined]);
	};
	const handleDelete = () => {
		let newVal = [...val];
		newVal.splice(-1);
		setVal(newVal);
	};

	return (
		<main className="min-h-screen w-screen py-24 bg-black text-center overflow-hidden">
			<h1 className="text-white text-5xl font-black">SimuTrade</h1>
			<div className="canvas flex bg-white h-[400px] w-11/12 overflow-scroll my-8 mx-auto">
				{val.map((_: any, i: any) => (
					<Candlestick
						color="green"
						xPosition={i}
						yPosition={100}
						key={i}
					/>
				))}
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
