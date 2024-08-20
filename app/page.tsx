export default function Home() {
	return (
		<main className="w-screen h-screen relative">
			<video src="/main.mp4" autoPlay muted loop></video>
			<div className="w-full h-full absolute left-0 top-0 opacity-40 bg-black"></div>
			<div className="text-white justify-center items-center text-8xl font-semibold absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
				<h1 className="w-fit">Welcome To</h1>
				<h1 className="typewriter text-tertiary w-fit">SimuTrade.</h1>
			</div>
		</main>
	);
}
