import Image from "next/image";
import Canvas from "@/components/Canvas";

export default function Home() {
	return (
		<main className="min-h-screen max-w-screen py-1 bg-black text-center font-custom">
			<h1 className="text-white text-5xl font-medium my-10">SimuTrade</h1>
			<Canvas />
		</main>
	);
}
