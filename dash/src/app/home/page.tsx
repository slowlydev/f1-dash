// "use client";

import Image from "next/image";

import tagLogo from "../../../public/tag-logo.png";

import Footer from "../../components/Footer";

export default function Page() {
  return (
    <div className="container px-4">
      <div className="flex w-full flex-col items-center">
        <Image src={tagLogo} alt="f1-dash" className="w-[180px]" />

        <h1 className=" text-center text-6xl font-bold text-white">
          Real-time Formula 1 telemetry and timing
        </h1>
      </div>

      <Footer />
    </div>
  );
}
