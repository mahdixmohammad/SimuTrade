import Image from "next/image";

interface ControlsProps {
	fastForwarding: boolean;
	fastBackwarding: boolean;
	setForwarding: Function;
	setBackwarding: Function;
	handleAdd: () => void;
	handleDelete: () => void;
}

export default function Controls({ fastForwarding, fastBackwarding, setForwarding, setBackwarding, handleAdd, handleDelete }: ControlsProps) {
	return (
		<div className="playback-controls z-10 flex justify-center items-center absolute bottom-20 left-0 right-0 gap-4 md:gap-6 mx-auto bg-primary w-10/12 sm:w-2/4 md:w-[450px] h-20 rounded-2xl border-2 border-secondary duration-100">
			<Image
				className="w-10 md:w-[50px] mx-4 md:mx-8 cursor-pointer"
				src="/fastbackward-icon.png"
				alt="Fast Backward"
				title="Fast Backward"
				width={50}
				height={0}
				style={{ height: "auto" }}
				onClick={() => {
					setForwarding(false);
					setBackwarding(true);
				}}
			/>
			<Image
				className="w-7 md:w-[35px] cursor-pointer"
				src="/backward-icon.png"
				alt="Backward"
				title="Backward"
				width={35}
				height={0}
				style={{ height: "auto" }}
				onClick={handleDelete}
			/>
			{fastForwarding || fastBackwarding ? (
				<Image
					className="w-7 md:w-[35px] cursor-pointer"
					src="/pause-icon.png"
					alt="Pause"
					title="Pause"
					width={35}
					height={0}
					style={{ height: "auto" }}
					onClick={() => {
						setForwarding(false);
						setBackwarding(false);
					}}
				></Image>
			) : (
				<Image
					className="w-7 md:w-[35px] cursor-pointer"
					src="/play-icon.png"
					alt="Play"
					title="Play"
					width={35}
					height={0}
					style={{ height: "auto" }}
				></Image>
			)}
			<Image
				className="w-7 md:w-[35px] cursor-pointer"
				src="/forward-icon.png"
				alt="Forward"
				title="Forward"
				width={35}
				height={0}
				style={{ height: "auto" }}
				onClick={handleAdd}
			/>
			<Image
				className="w-10 md:w-[50px] mx-4 md:mx-8 cursor-pointer"
				src="/fastforward-icon.png"
				alt="Fast Forward"
				title="Fast Forward"
				width={50}
				height={0}
				style={{ height: "auto" }}
				onClick={() => {
					setForwarding(true);
					setBackwarding(false);
				}}
			/>
		</div>
	);
}
