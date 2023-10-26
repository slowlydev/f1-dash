// "use client";

import Link from "next/link";
import Image from "next/image";

import { env } from "../../env.mjs";
import { exampleDriver } from "../help/example-driver";

import mapFeature from "../../../public/map-feature-home.png";
import tagLogo from "../../../public/tag-logo.png";

import softTireIcon from "../../../public/tires/soft.svg";
import mediumTireIcon from "../../../public/tires/medium.svg";
import hardTireIcon from "../../../public/tires/hard.svg";
import intermediateTireIcon from "../../../public/tires/intermediate.svg";
import wetTireIcon from "../../../public/tires/wet.svg";

import Footer from "../../components/Footer";
import DriverMiniSectors from "../../components/DriverMiniSectors";
import DriverTire from "../../components/DriverTire";
import UpNextMeeting from "../../components/UpNext";
import DriverInfo from "../../components/DriverInfo";

import { NextMeeting } from "../../types/nextMeeting.type";

const getNextMeeting = async (): Promise<NextMeeting> => {
  const req = await fetch(`${env.NEXT_PUBLIC_SERVER_URL}/api/next-meeting`);
  const res: NextMeeting = await req.json();
  return res;
};

export default async function Page() {
  const nextMeeting = await getNextMeeting();

  const featureClass =
    "col-span-6 flex flex-col gap-2 rounded-lg bg-gray-500 bg-opacity-20 p-4";

  return (
    <div className="container mx-auto px-4">
      <div className="flex gap-4">
        <Link href="/home">Home</Link>
        <Link href="/">Dashboard</Link>
        <Link href="/archive">Archive</Link>
      </div>

      <div className="flex h-[50vh] w-full flex-col items-center justify-center">
        <Image src={tagLogo} alt="f1-dash" className="w-[180px]" />
        <h1 className="text-center text-6xl font-bold text-white">
          Real-time Formula 1 telemetry and timing
        </h1>

        {/* github */}
      </div>

      <div className="mb-4">
        <h2 className="mb-4 text-3xl font-bold">Core Features</h2>

        <div className="grid grid-cols-12 gap-2">
          <div className={featureClass}>
            <p className="text-lg leading-none">Tires & Pitstops</p>
            <p className="leading-none text-gray-400">
              Discover which tires the drivers are using and how old they are.
              As well as their numbers of pitstops.
            </p>
            <div className="flex gap-2 rounded-lg bg-zinc-900 p-4">
              <div className="flex space-x-[-1rem] ">
                <Image src={softTireIcon} alt="soft" className="h-8 w-8" />
                <Image src={mediumTireIcon} alt="medium" className="h-8 w-8" />
                <Image src={hardTireIcon} alt="hard" className="h-8 w-8" />
                <Image
                  src={intermediateTireIcon}
                  alt="intermediates"
                  className="h-8 w-8"
                />
                <Image src={wetTireIcon} alt="wets" className="h-8 w-8" />
              </div>

              <DriverTire stints={exampleDriver.stints} />
            </div>
          </div>

          <div className={featureClass}>
            <p className="text-lg font-medium leading-none">Sectores</p>
            <p className="leading-none text-gray-400">
              See Sectore Times and even Minisector data, to figure out whos on
              a potential personal best or even fastest lap.
            </p>
            <div className="rounded-lg bg-zinc-900 p-4">
              <DriverMiniSectors
                driverDisplayName="test"
                sectors={exampleDriver.sectors}
              />
            </div>
          </div>

          <div className={featureClass}>
            <p className="text-lg font-medium leading-none">Track Map</p>
            <p className="leading-none text-gray-400">
              See the postion of the drivers in realtime. Where and if drivers
              crashed and their status.
            </p>
            <div className="rounded-lg bg-zinc-900">
              <Image src={mapFeature} alt="" className="rounded-lg" />
            </div>
          </div>

          <div className={featureClass}>
            <p className="text-lg font-medium leading-none">TBD</p>
            <p className="leading-none text-gray-400">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Reprehenderit dolores
            </p>
            <div className="rounded-lg bg-zinc-900 p-4">
              <DriverInfo
                laps={exampleDriver.laps}
                status={exampleDriver.status}
              />
            </div>
          </div>
        </div>
      </div>

      <UpNextMeeting nextMeeting={nextMeeting} />

      {/* TODO add arrow to right */}
      <Link href="/archive">Checkout the archive</Link>

      <div>
        <h2 className="mb-4 text-3xl font-bold"></h2>
      </div>

      <Footer />
    </div>
  );
}
