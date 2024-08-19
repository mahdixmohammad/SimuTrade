"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Navbar() {
	const path = usePathname();

	useEffect(() => {
		document.querySelector("nav ul li a.active")?.classList.remove("active");
		document.querySelector("nav ul li a.\\" + path)!.classList.add("active");
	}, [path]);

	return (
		<nav className="h-20 flex items-center justify-between px-20 text-white font-custom border-b-2 border-secondary">
			<h1 className="text-4xl font-medium">SimuTrade</h1>
			<ul className="flex gap-4 text-2xl">
				<li>
					<Link href="/" className="/">
						Home
					</Link>
				</li>
				<li>
					<Link href="/simulation" className="/simulation">
						Simulation
					</Link>
				</li>
				<li>
					<Link href="/login" className="/login">
						Log in
					</Link>
				</li>
			</ul>
		</nav>
	);
}
