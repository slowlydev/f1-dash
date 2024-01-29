import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { utc } from "moment";

import DriverTag from "./DriverTag";
import PlayControls from "./PlayControls";
import AudioProgress from "./AudioProgress";

import { TeamRadioType } from "@/types/state.type";

type Props = {
	teamRadio: TeamRadioType;
};

export default function TeamRadioMessage({ teamRadio }: Props) {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);

	const [playing, setPlaying] = useState<boolean>(false);
	const [duration, setDuration] = useState<number>(0);
	const [progress, setProgress] = useState<number>(0);

	const loadMeta = () => {
		if (!audioRef.current) return;
		setDuration(audioRef.current.duration);
	};

	const onEnded = () => {
		setPlaying(false);
		setProgress(0);

		if (intervalRef.current) {
			clearInterval(intervalRef.current);
		}
	};

	const updateProgress = () => {
		if (!audioRef.current) return;
		setProgress(audioRef.current.currentTime);
	};

	const togglePlayback = () => {
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
			}

			return !old;
		});
	};

	return (
		<motion.li animate={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: -20 }} className="flex flex-col gap-1">
			<time
				className="text-sm font-medium leading-none text-gray-500"
				dateTime={utc(teamRadio.utc).local().format("HH:mm:ss")}
			>
				{utc(teamRadio.utc).local().format("HH:mm:ss")}
			</time>

			<div
				className="grid place-items-center items-center gap-4"
				style={{
					gridTemplateColumns: "2rem 20rem",
				}}
			>
				<div className="w-10 place-self-start">
					<DriverTag teamColor={teamRadio.teamColor} short={teamRadio.short} />
				</div>

				<div className="flex items-center gap-4">
					<PlayControls playing={playing} onClick={togglePlayback} />
					<AudioProgress duration={duration} progress={progress} />

					<audio
						src={teamRadio.audioUrl}
						ref={audioRef}
						onEnded={() => onEnded()}
						onLoadedMetadata={() => loadMeta()}
					/>
				</div>
			</div>
		</motion.li>
	);
}
