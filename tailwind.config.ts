import type { Config } from "tailwindcss";

const config: Config = {
	content: ["./pages/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}", "./app/**/*.{js,ts,jsx,tsx,mdx}"],
	theme: {
		extend: {
			textColor: {
				tertiary: "rgb(186, 162, 66)",
			},
			borderColor: {
				secondary: "rgb(60, 60, 60)",
				tertiary: "rgb(186, 162, 66)",
			},
			backgroundColor: {
				primary: "rgb(30, 30, 30)",
				tertiary: "rgb(186, 162, 66)",
			},
			fontFamily: {
				poppins: ["Poppins"],
				kanit: ["Kanit"],
			},
			outlineColor: {
				tertiary: "rgb(186, 162, 66)",
			},
		},
	},
	plugins: [],
};
export default config;
