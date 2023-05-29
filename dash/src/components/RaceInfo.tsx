import Image from "next/image";

export default function RaceInfo() {
  const race = {
    country: "az",
    name: "Bahrain Grand Prix",
    sessionType: "Race",
    sessionTime: "32:46",
    trackClear: true,
  };

  return (
    <div className="flex flex-row items-center gap-4">
      <div className="flex content-center justify-center overflow-hidden rounded-md">
        <Image
          src={`/flags/${race.country}.svg`}
          alt={race.country}
          width={60}
          height={30}
        />
      </div>

      <div className="flex flex-col">
        <h1 className="text-lg">
          {race.name}: {race.sessionType}
        </h1>
        <p className="text-2xl font-extrabold">{race.sessionTime}</p>
      </div>
    </div>
  );
}
