"use client";

import { utc, duration } from "moment";
import Image from "next/image";

import { ExtrapolatedClock } from "../types/extrapolated-clock.type";
import { SessionInfo } from "../types/session.type";

type Props = {
  session: SessionInfo | undefined;
  clock: ExtrapolatedClock | undefined;
};

export default function SessionInfo({ session, clock }: Props) {
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

  return (
    <div className="flex flex-auto items-center gap-3">
      <Flag countryCode={session?.countryCode} />

      <div className="flex flex-grow flex-col justify-center">
        {session ? (
          <h1 className="truncate text-sm font-medium text-gray-500">
            {session.name}: {session.typeName ?? "unknown"}
            {!!session.number ? ` Q${session.number}` : ""}
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
