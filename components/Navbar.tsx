"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function Navbar() {
	const path = usePathname();

	useEffect(() => {
		const nav = document.querySelector("nav")!;

		if (path === "/") {
			nav.style.backgroundColor = "transparent";
		} else {
			nav.style.backgroundColor = "rgb(30, 30, 30)";
		}

		document.querySelector("nav ul li a.active")?.classList.remove("active");
		document.querySelector("nav ul li a.\\" + path)!.classList.add("active");
	}, [path]);

	return (
		<nav className="z-50 w-screen h-20 absolute top-0 bg-transparent flex items-center justify-between px-20 text-white">
			<Link href="/" className="flex items-center gap-3">
				<Image src="/simutrade-icon.png" width={35} height={35} alt="" />
				<h1 className="text-4xl font-normal">SimuTrade</h1>
			</Link>
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
					<Link href="/dashboard" className="/dashboard">
						Dashboard
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
