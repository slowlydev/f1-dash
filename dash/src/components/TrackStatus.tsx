"use client";

import clsx from "clsx";

import { getTrackStatusMessage } from "../lib/getTrackStatusMessage";

import { TrackStatus } from "../types/track-status.type";

type Props = {
  track: TrackStatus | undefined;
};

export default function TrackStatus({ track }: Props) {
  const currentTrackStatus = getTrackStatusMessage(track?.status);

  return (
    <div
      className={clsx(
        "flex w-full flex-row items-center justify-between gap-4 sm:w-auto"
      )}
    >
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
