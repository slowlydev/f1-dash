"use client";

import Image from "next/image";
import { SessionInfo } from "../types/session.type";
import { ExtrapolatedClock } from "../types/extrapolated-clock.type";
import moment from "moment";
import { TrackStatus } from "../types/track-status.type";
import clsx from "clsx";

type Props = {
  session?: SessionInfo;
  clock?: ExtrapolatedClock;
  track?: TrackStatus;
};

export default function RaceInfo({ session, clock, track }: Props) {
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
      <div className="flex items-center justify-center gap-2">
        <Flag countryCode={session?.countryCode} />

        <div className="flex flex-col">
          {session ? (
            <h1 className="text-lg">
              {session.countryName} {session.name}: {session.type ?? "unknown"}
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

      <div className="items- flex">
        <div
          className={clsx("flex h-8 items-center rounded-md px-2", {
            "bg-red-500": track?.status === 5,
            "bg-emerald-500": track?.status === 1,
          })}
        >
          <p>{track?.statusMessage}</p>
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
          className="w-21 h-14 overflow-hidden rounded-lg"
        />
      ) : (
        <div className="w-21 h-14 animate-pulse rounded-lg bg-gray-700" />
      )}
    </div>
  );
};
