import type { Metadata } from "next";
import { Kanit } from "next/font/google";
import "./globals.css";
import StoreProvider from "./StoreProvider";
import Navbar from "@/components/Navbar";

const kanit = Kanit({ weight: ["400", "500", "600", "700"], style: ["normal", "italic"], subsets: ["latin"] });

export const metadata: Metadata = {
	title: "SimuTrade",
	description: "Simulate candlesticks for backtesting.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<StoreProvider>
			<html lang="en">
				<body className={kanit.className}>
					{/* <Navbar /> */}
					{children}
				</body>
			</html>
		</StoreProvider>
	);
}
