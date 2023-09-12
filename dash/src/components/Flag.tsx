import Image from "next/image";

type Props = {
  countryCode: string | undefined;
};

export default function Flag({ countryCode }: Props) {
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
}
