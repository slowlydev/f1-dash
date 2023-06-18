"use client";

import Image from "next/image";
import { SessionInfo } from "../types/session.type";
import { ExtrapolatedClock } from "../types/extrapolated-clock.type";
import moment from "moment";
import { TrackStatus } from "../types/track-status.type";
import clsx from "clsx";
import { LapCount } from "../types/lap-count.type";
import { getTrackStatusMessage } from "../lib/getTrackStatusMessage";

type Props = {
  session: SessionInfo | undefined;
  clock: ExtrapolatedClock | undefined;
  track: TrackStatus | undefined;
  lapCount: LapCount | undefined;
};

export default function RaceInfo({ session, clock, track, lapCount }: Props) {
  const timeRemaining =
    !!clock && !!clock.remaining
      ? clock.extrapolating
        ? moment
            .utc(
              moment
                .duration(clock.remaining)
                .subtract(moment.utc().diff(moment.utc(clock.utc)))
                .asMilliseconds()
            )
            .format("HH:mm:ss")
        : clock.remaining
      : undefined;

  return (
    <div className="flex justify-between gap-1">
      <div className="flex flex-auto items-center space-x-3 overflow-hidden">
        <Flag countryCode={session?.countryCode} />

        <div className="flex w-3/4 flex-col justify-center">
          {session ? (
            <h1 className="truncate text-sm font-medium text-gray-500">
              {session.name}: {session.type ?? "unknown"}
            </h1>
          ) : (
            <div className="h-6 w-[30rem] animate-pulse rounded-md bg-gray-700 font-semibold" />
          )}

          {timeRemaining !== undefined ? (
            <p className="text-2xl font-extrabold">{timeRemaining}</p>
          ) : (
            <div className="mt-1 h-8 w-[8rem] animate-pulse rounded-md bg-gray-700 font-semibold" />
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {!!lapCount && (
          <p className="text-3xl font-extrabold">
            {lapCount?.current} / {lapCount?.total}
          </p>
        )}

        <div
          className={clsx(
            "flex h-8 items-center rounded-md px-2",
            getTrackStatusMessage(track?.status ?? null).color
          )}
        >
          <p className="text-xl font-semibold">
            {getTrackStatusMessage(track?.status ?? null).message}
          </p>
        </div>

        <div
          className={clsx(
            getTrackStatusMessage(track?.status ?? null).color,
            "absolute right-0 top-0 z-[-10] h-[2rem] w-[15rem]"
          )}
        >
          <div
            className={clsx(
              "absolute right-0 top-0 z-[-10] h-[8rem] w-[25rem] backdrop-blur-[40px]"
            )}
          />
        </div>
      </div>
    </div>
  );
}

type FlagProps = {
  countryCode: string | undefined;
};

const Flag = ({ countryCode }: FlagProps) => {
  return (
    <div className="flex content-center justify-center">
      {countryCode ? (
        <Image
          src={`/flags/${countryCode
            .toLowerCase()
            .substring(0, countryCode.toLowerCase().length - 1)}.svg`}
          alt={countryCode}
          width={70}
          height={35}
          className="relative h-12 w-14 overflow-hidden rounded-lg"
        />
      ) : (
        <div className="relative h-12 w-14 animate-pulse overflow-hidden rounded-lg bg-gray-700" />
      )}
    </div>
  );
};
