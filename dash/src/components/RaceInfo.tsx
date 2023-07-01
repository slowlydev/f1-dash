"use client";

import { utc, duration } from "moment";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";

import { ExtrapolatedClock } from "../types/extrapolated-clock.type";

import { getTrackStatusMessage } from "../lib/getTrackStatusMessage";

import { SessionInfo } from "../types/session.type";
import { LapCount } from "../types/lap-count.type";
import { TrackStatus } from "../types/track-status.type";

import settingsIcon from "../../public/icons/settings.svg";

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
        ? utc(
            duration(clock.remaining)
              .subtract(utc().diff(utc(clock.utc)))
              .asMilliseconds()
          ).format("HH:mm:ss")
        : clock.remaining
      : undefined;

  const currentTrackStatus = getTrackStatusMessage(track?.status);

  return (
    <div className="flex flex-wrap justify-between gap-2">
      <div className="flex flex-1 items-center justify-between gap-8">
        <div className="flex flex-auto items-center gap-3">
          <Flag countryCode={session?.countryCode} />

          <div className="flex flex-grow flex-col justify-center">
            {session ? (
              <h1 className="truncate text-sm font-medium text-gray-500">
                {session.name}: {session.typeName ?? "unknown"}
              </h1>
            ) : (
              <div className="h-4 w-2/3 animate-pulse rounded-md bg-gray-700" />
            )}

            {timeRemaining !== undefined ? (
              <p className="text-2xl font-extrabold">{timeRemaining}</p>
            ) : (
              <div className="mt-1 h-6 w-2/5 animate-pulse rounded-md bg-gray-700 font-semibold" />
            )}
          </div>
        </div>

        <Link href="/settings" className="block cursor-pointer sm:hidden">
          <Image
            src={settingsIcon}
            alt="settings"
            className="mr-1 opacity-40"
          />
        </Link>
      </div>

      <div className="flex w-full flex-row-reverse items-center justify-between gap-4 sm:w-auto sm:flex-row">
        <Link href="/settings" className="hidden cursor-pointer sm:block">
          <Image
            src={settingsIcon}
            alt="settings"
            className="mr-1 opacity-40"
          />
        </Link>

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
            <p className="text-xl font-semibold">
              {currentTrackStatus.message}
            </p>
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
    </div>
  );
}

type FlagProps = {
  countryCode: string | undefined;
};

const Flag = ({ countryCode }: FlagProps) => {
  return (
    <div className="flex h-12 w-16  content-center justify-center">
      {countryCode ? (
        <Image
          src={`/country-flags/${countryCode.toLowerCase()}.svg`}
          alt={countryCode}
          width={70}
          height={35}
          className="relative h-full w-full overflow-hidden rounded-lg"
        />
      ) : (
        <div className="relative h-full w-full animate-pulse overflow-hidden rounded-lg bg-gray-700" />
      )}
    </div>
  );
};
