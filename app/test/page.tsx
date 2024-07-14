import Canvas from "@/components/Canvas";

export default function Home() {
	return (
		<main className="min-h-screen max-w-screen bg-black text-white text-center py-1">
			<h1 className="font-custom font-medium text-5xl my-10">SimuTrade</h1>
			<Canvas />
		</main>
	);
}
