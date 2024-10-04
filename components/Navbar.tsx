"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navbar() {
	const path = usePathname();
	const [menuOpen, setMenuOpen] = useState(false); // State to track if the menu is open
	const [isAuth, setIsAuth] = useState(false); // State to track authentication status

	useEffect(() => {
		const nav = document.querySelector("nav")!;

		if (path === "/") {
			nav.style.backgroundColor = "transparent";
		} else {
			nav.style.backgroundColor = "rgb(30, 30, 30)";
		}

		document.querySelector("nav ul li a.active")?.classList.remove("active");
		document.querySelector("nav ul li a.\\" + path)!.classList.add("active");

		// Fetch the authentication status
		const fetchAuthStatus = async () => {
			const res = await fetch("/api/session"); // Assuming you have a session API route
			if (res.ok) {
				const { isAuth } = await res.json();
				setIsAuth(isAuth);
			}
		};

		fetchAuthStatus();
	}, [path]);

	// Toggle the menuOpen state on hamburger or x click
	const toggleMenu = () => {
		setMenuOpen(!menuOpen);
	};

	const handleLogout = async () => {
		try {
			const res = await fetch("/api/logout", { method: "POST" });

			if (res.ok) {
				// Redirect to the login page or the home page after successful logout
				window.location.href = "/login";
			} else {
				// Handle logout error if necessary
				console.error("Logout failed", res);
			}
		} catch (error) {
			console.error("An error occurred during logout:", error);
		}
	};

	return (
		<nav
			className={`${
				menuOpen ? `active` : ``
			} z-50 w-screen h-20 absolute top-0 bg-transparent overflow-hidden flex items-center justify-center px-20 text-white duration-500 lg:justify-between`}
		>
			<Link href="/" className="flex items-center gap-3">
				<Image src="/simutrade-icon.png" width={35} height={35} alt="" />
				<h1 className="hidden sm:block text-4xl font-normal">SimuTrade</h1>
			</Link>
			{/* Hamburger icon (visible when menu is closed) */}
			{!menuOpen && (
				<div className="hamburger absolute right-12 flex flex-col gap-1 cursor-pointer lg:hidden" onClick={toggleMenu}>
					<div className="w-7 h-1 bg-white rounded-md"></div>
					<div className="w-7 h-1 bg-white rounded-md"></div>
					<div className="w-7 h-1 bg-white rounded-md"></div>
				</div>
			)}
			{/* X icon (visible when menu is open) */}
			{menuOpen && (
				<div className="x absolute w-7 h-7 right-12 flex justify-center items-center cursor-pointer lg:hidden" onClick={toggleMenu}>
					<div className="w-8 h-0.5 absolute rotate-45 bg-white rounded-md"></div>
					<div className="w-8 h-0.5 absolute -rotate-45 bg-white rounded-md"></div>
				</div>
			)}
			<ul className="lg:gap-4 lg:text-2xl lg:flex">
				<li>
					<Link href="/" className="/">
						<span>Home</span>
					</Link>
				</li>
				<li>
					<Link href="/simulation" className="/simulation">
						<span>Simulation</span>
					</Link>
				</li>
				<li>
					<Link href="/dashboard" className="/dashboard">
						<span>Dashboard</span>
					</Link>
				</li>
				<li>
					{isAuth ? (
						<button onClick={handleLogout} className="text-white bg-transparent border-none cursor-pointer">
							Log out
						</button>
					) : (
						<Link href="/login" className="/login">
							<span>Log in</span>
						</Link>
					)}
				</li>
			</ul>
		</nav>
	);
}
