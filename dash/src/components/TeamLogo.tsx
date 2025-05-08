import Image from "next/image";

type Props = {
    teamName: string | undefined;
    width: number | undefined;
    height: number | undefined;
};

export default function TeamLogo({ teamName, width, height }: Props) {
    return (
        <div className="flex content-center justify-center">
            {teamName ? (
                <Image
                    src={`/team-logos/${teamName.toLowerCase()}.${"png"}`}
                    alt={teamName}
                    width={width}
                    height={height}
                    className="overflow-hidden rounded-lg"
                />
            ) : (
                <div className="h-full w-full animate-pulse overflow-hidden rounded-lg bg-zinc-800" />
            )}
        </div>
    );
}
