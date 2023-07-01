"use client";

import Image from "next/image";
import Link from "next/link";

import arrowIcon from "../../../public/icons/arrow-up.svg";

import helpDriverImage from "../../../public/help-driver.png";

import HelpDRS from "../../components/HelpDRS";
import HelpColors from "../../components/HelpColors";
import HelpTires from "../../components/HelpTires";

export default function Page() {
  return (
    <div className="container m-auto sm:pt-10">
      <Link href="/">
        <div className="mb-2 flex items-center gap-1">
          <Image
            src={arrowIcon}
            alt="arrow left"
            className="h-6 w-6 -rotate-90 opacity-50"
          />
          <p className="text-md text-gray-500">Back</p>
        </div>
      </Link>

      <h1 className="mb-2 text-3xl font-extrabold">Help</h1>

      <p>
        Do you feel overwhelmed or don't understand the data? <br />
        Then this is your page! It explains the what what is, when it changes,
        how it can change <br /> and the meaning of the different colors.
      </p>

      <h3 className="mt-4 text-2xl font-semibold">The Leader board</h3>

      <Image src={helpDriverImage} alt="driver with help" />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <HelpDRS />
        <HelpColors />
        <HelpTires />
      </div>
    </div>
  );
}
