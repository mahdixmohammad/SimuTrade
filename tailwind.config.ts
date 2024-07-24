import type { Config } from "tailwindcss";

const config: Config = {
	content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
			borderColor: {
				secondary: "rgb(50, 50, 50)",
			},
			backgroundColor: {
				primary: "rgb(20, 20, 20)",
			},
			fontFamily: {
				custom: ["Poppins"],
			},
		},
	},
	plugins: [],
};
export default config;
