export default function Navbar() {
	return (
		<nav className="bg-primary h-24 mb-10 flex items-center justify-between px-20 text-white font-custom border-b-2 border-secondary">
			<h1 className="text-4xl font-medium">SimuTrade</h1>
			<ul className="flex gap-7 text-2xl">
				<li>Home</li>
				<li>Simulation</li>
				<li>Log in</li>
			</ul>
		</nav>
	);
}
