"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getUser } from "@/actions/action";

export default function LoginPage() {
	const [statusObject, setStatus] = useState({ status: 0, message: "" }); // State: -1 for error, 0 for neutral, 1 for success

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		setStatus(await getUser(formData));
	};

	return (
		<main className="w-screen h-screen">
			<div className="text-black absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-5">
				<Link href="/">
					<Image src="/simutrade-icon.png" width={35} height={35} alt="" />{" "}
				</Link>
				<h3 className="text-3xl font-medium">Log in to SimuTrade</h3>
				<form onSubmit={handleSubmit} className="flex flex-col gap-5 text-center">
					<input
						name="Username"
						placeholder="Username"
						required
						className="w-[325px] px-2 py-3 rounded-md border-[1px] border-gray-400 outline-tertiary hover:border-black duration-150"
					></input>
					<input
						name="Password"
						placeholder="Password"
						type="password"
						required
						className="px-2 py-3 rounded-md border-[1px] border-gray-400 outline-tertiary hover:border-black duration-150"
					></input>
					<button type="submit" className="bg-tertiary py-3 rounded-lg font-poppins">
						Log in
					</button>
					{statusObject.status === 1 && <p className="w-[325px] text-green-500">Success! Account logged in.</p>}
					{statusObject.status === -1 && <p className="w-[325px] text-red-500">Error! {statusObject.message}</p>}
					<p>
						Or make a new account by{" "}
						<Link href="/signup" className="cursor-pointer underline text-blue-400">
							signing up
						</Link>
						.
					</p>
				</form>
			</div>
		</main>
	);
}
