import Canvas from "@/components/Canvas";
import Dashboard from "@/components/Dashboard";

export default function Home() {
	return (
		<main className="min-h-screen max-w-screen py-8 bg-black text-center font-custom">
			<h1 className="text-white text-5xl font-medium mb-10">SimuTrade</h1>
			<Canvas />
			<Dashboard />
		</main>
	);
}
