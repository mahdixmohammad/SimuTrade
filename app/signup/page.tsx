"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { signup } from "@/actions/action";

export default function SignUpPage() {
	const [statusObject, setStatus] = useState({ status: 0, message: "" }); // State: -1 for error, 0 for neutral, 1 for success

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const formData = new FormData(event.target as HTMLFormElement);
		await signup(formData);
		setStatus({ status: -1, message: "Error creating account." });
	};

	return (
		<main className="w-screen h-screen relative">
			<div className="text-black absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-5">
				<Link href="/">
					<Image src="/simutrade-icon.png" width={35} height={35} alt="" />{" "}
				</Link>
				<h3 className="text-3xl font-medium">Sign up to SimuTrade</h3>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4 text-center">
					<div className="w-[325px] gap-4 flex">
						<input
							name="First Name"
							placeholder="First Name"
							required
							className="w-[155px] px-2 py-2 rounded-md border-[1px] border-gray-400 outline-tertiary hover:border-black duration-150"
						></input>
						<input
							name="Last Name"
							placeholder="Last Name"
							required
							className="w-[155px] px-2 py-2 rounded-md border-[1px] border-gray-400 outline-tertiary hover:border-black duration-150"
						></input>
					</div>
					<input
						name="Username"
						placeholder="Username"
						required
						className="w-[325px] px-2 py-2 rounded-md border-[1px] border-gray-400 outline-tertiary hover:border-black duration-150"
					></input>
					<input
						name="Email"
						placeholder="Email"
						required
						className="w-[325px] px-2 py-2 rounded-md border-[1px] border-gray-400 outline-tertiary hover:border-black duration-150"
					></input>
					<input
						name="Password"
						placeholder="Password"
						type="password"
						required
						className="w-[325px] px-2 py-2 rounded-md border-[1px] border-gray-400 outline-tertiary hover:border-black duration-150"
					></input>
					<input
						name="Confirm Password"
						placeholder="Confirm Password"
						type="password"
						required
						className="w-[325px] px-2 py-2 rounded-md border-[1px] border-gray-400 outline-tertiary hover:border-black duration-150"
					></input>
					<button type="submit" className="w-[325px] bg-tertiary py-2 rounded-lg font-poppins">
						Sign up
					</button>
					{statusObject.status === 1 && <p className="w-[325px] text-green-500">Success! Accounted created.</p>}
					{statusObject.status === -1 && <p className="w-[325px] text-red-500">Error! {statusObject.message}</p>}
					<p>
						Or{" "}
						<Link href="/login" className="cursor-pointer underline text-blue-400">
							log in
						</Link>{" "}
						to an existing account.
					</p>
				</form>
			</div>
		</main>
	);
}
