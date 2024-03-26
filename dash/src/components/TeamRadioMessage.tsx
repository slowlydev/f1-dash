import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { utc } from "moment";

import DriverTag from "./driver/DriverTag";
import PlayControls from "./PlayControls";
import AudioProgress from "./AudioProgress";

import { Driver, RadioCapture } from "@/types/state.type";

type Props = {
	driver: Driver;
	capture: RadioCapture;
	basePath: string;
};

export default function TeamRadioMessage({ driver, capture, basePath }: Props) {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const [state, setState] = useState<"idle" | "loading" | "loaded">("idle");
	const [playing, setPlaying] = useState<boolean>(false);
	const [duration, setDuration] = useState<number>(10);
	const [progress, setProgress] = useState<number>(0);

	const loadMeta = () => {
		if (!audioRef.current) return;
		setDuration(audioRef.current.duration);
	};

	const onLoaded = () => {
		if (!audioRef.current) return;

		setState("loaded");
		setPlaying(true);
		audioRef.current.play();
		intervalRef.current = setInterval(updateProgress, 10);
	};

	const onEnded = () => {
		setPlaying(false);
		setProgress(0);

		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}

		setState("idle");
	};

	const updateProgress = () => {
		if (!audioRef.current) return;
		setProgress(audioRef.current.currentTime);
	};

	const togglePlayback = () => {
		if (state === "loading") {
			setState("idle");
			return;
		}

		if (state === "idle") {
			setState("loading");
			return;
		}

		setPlaying((old) => {
			if (!audioRef.current) return old;

			if (!old) {
				audioRef.current.play();

				intervalRef.current = setInterval(updateProgress, 10);
			} else {
				audioRef.current.pause();

				if (intervalRef.current) {
					clearInterval(intervalRef.current);
				}

				// remove audio tag and 'unload' after 10 seconds
				setTimeout(() => {
					setState("idle");
					setProgress(0);
				}, 10000);
			}

			return !old;
		});
	};

	return (
		<motion.li animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: -20 }} className="flex flex-col gap-1">
			<time
				className="text-sm font-medium leading-none text-gray-500"
				dateTime={utc(capture.utc).local().format("HH:mm:ss")}
			>
				{utc(capture.utc).local().format("HH:mm:ss")}
			</time>

			<div
				className="grid place-items-center items-center gap-1"
				style={{
					gridTemplateColumns: "2rem 20rem",
				}}
			>
				<div className="w-10 place-self-start">
					<DriverTag teamColor={driver.teamColour} short={driver.tla} />
				</div>

				<div className="flex items-center gap-1">
					<PlayControls playing={playing} onClick={togglePlayback} loading={state === "loading"} />
					<AudioProgress duration={duration} progress={progress} />

					{(state === "loading" || state === "loaded") && (
						<audio
							src={`${basePath}${capture.path}`}
							ref={audioRef}
							onEnded={() => onEnded()}
							onLoadedData={() => onLoaded()}
							onLoadedMetadata={() => loadMeta()}
						/>
					)}
				</div>
			</div>
		</motion.li>
	);
}
