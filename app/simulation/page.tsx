import Canvas from "@/components/Canvas";
import Navbar from "@/components/Navbar";

export default function SimulationPage() {
	return (
		<main className="w-screen h-screen overflow-hidden text-center">
			<Navbar />
			<Canvas />
		</main>
	);
}
