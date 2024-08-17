import Link from "next/link";

export default function Navbar() {
	return (
		<nav className="bg-primary h-20 mb-10 flex items-center justify-between px-20 text-white font-custom border-b-2 border-secondary">
			<h1 className="text-4xl font-medium">SimuTrade</h1>
			<ul className="flex gap-4 text-2xl">
				<li>
					<Link href="/">Home</Link>
				</li>
				<li>
					<Link href="/simulation" className="active">
						Simulation
					</Link>
				</li>
				<li>
					<Link href="/login">Log in</Link>
				</li>
			</ul>
		</nav>
	);
}
