import type { Config } from "tailwindcss";

const config: Config = {
	content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
			borderColor: {
				secondary: "rgb(100, 100, 100)",
			},
			backgroundColor: {
				primary: "rgb(25, 25, 25)",
				tertiary: "rgb(195, 172, 28)",
			},
			fontFamily: {
				custom: ["Poppins"],
			},
		},
	},
	plugins: [],
};
export default config;
