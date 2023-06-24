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
    <div className="flex gap-1">
      <div className="flex flex-auto items-center gap-3">
        <Flag countryCode={session?.countryCode} />

        <div className="flex flex-col justify-center">
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

      <div className="flex items-center justify-end gap-2">
        {!!lapCount && (
          <p className="whitespace-nowrap text-3xl font-extrabold sm:text-3xl">
            {lapCount?.current} / {lapCount?.total}
          </p>
        )}

        <div
          className={clsx(
            "flex h-8 items-center truncate rounded-md px-2",
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
            "absolute right-0 top-0 z-[-10] h-[2rem] w-2/5 sm:w-[15rem]"
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
    <div className="hidden content-center justify-center sm:flex">
      {countryCode ? (
        <Image
          src={`/country-flags/${
            countryCode.length > 2
              ? countryCode
                  .toLowerCase()
                  .substring(0, countryCode.toLowerCase().length - 1)
              : countryCode
          }.svg`}
          alt={countryCode}
          width={70}
          height={35}
          className="relative h-12 w-16 overflow-hidden rounded-lg"
        />
      ) : (
        <div className="relative h-12 w-16 animate-pulse overflow-hidden rounded-lg bg-gray-700" />
      )}
    </div>
  );
};
