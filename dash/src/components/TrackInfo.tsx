"use client";

import clsx from "clsx";

import { getTrackStatusMessage } from "../lib/getTrackStatusMessage";

import { LapCount } from "../types/lap-count.type";
import { TrackStatus } from "../types/track-status.type";
import ConnectionStatus from "./ConnectionStatus";
import HelpButton from "./HelpButton";

type Props = {
  track: TrackStatus | undefined;
  lapCount: LapCount | undefined;
  connected: boolean;
};

export default function TrackInfo({ track, lapCount, connected }: Props) {
  const currentTrackStatus = getTrackStatusMessage(track?.status);

  return (
    <div
      className={clsx(
        "flex w-full flex-row-reverse items-center justify-between gap-4 sm:w-auto sm:flex-row",
        { "!flex-row": !!!lapCount }
      )}
    >
      <ConnectionStatus connected={connected} defaultHidden={true} />

      <HelpButton defaultHidden={true} />

      {!!lapCount && (
        <p className="whitespace-nowrap text-3xl font-extrabold">
          {lapCount?.current} / {lapCount?.total}
        </p>
      )}

      {!!currentTrackStatus ? (
        <div
          className={clsx(
            "flex h-8 items-center truncate rounded-md px-2",
            currentTrackStatus.color
          )}
        >
          <p className="text-xl font-semibold">{currentTrackStatus.message}</p>
        </div>
      ) : (
        <div className="relative h-8 w-28 animate-pulse overflow-hidden rounded-lg bg-gray-700" />
      )}

      {!!currentTrackStatus && (
        <div
          className={clsx(
            currentTrackStatus.color,
            "absolute right-0 top-0 z-[-10] h-[2rem] w-2/5 sm:w-[15rem]",
            "invisible sm:visible"
          )}
        >
          <div
            className={clsx(
              "absolute right-0 top-0 z-[-10] h-[8rem] w-[25rem] backdrop-blur-[40px]"
            )}
          />
        </div>
      )}
    </div>
  );
}
