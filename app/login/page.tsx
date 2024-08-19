import Link from "next/link";

export default function LoginPage() {
	return (
		<main className="w-screen h-[80vh]">
			<div className="w-[400px] h-[400px] bg-primary border-2 border-secondary rounded-2xl p-5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-5">
				<h3 className="text-white text-2xl font-semibold">Log in to SimuTrade</h3>
				<form className="flex flex-col gap-4 text-center">
					<input placeholder="Username" required className="w-[300px] px-2 py-2 rounded-xl"></input>
					<input placeholder="Password" type="password" required className="px-2 py-2 rounded-xl"></input>
					<button className="bg-tertiary py-2 rounded-xl font-custom">Log in</button>
					<p className="text-white">
						Or make a new account by <span className="cursor-pointer underline text-blue-400">signing up</span>
					</p>
				</form>
			</div>
		</main>
	);
}
