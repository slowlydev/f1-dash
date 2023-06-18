import clsx from "clsx";

type Props = {
  toFront: string;
  toLeader: string;
  catching: boolean;
};

export default function DriverGap({ toFront, toLeader, catching }: Props) {
  return (
    <div className="place-self-start text-lg font-semibold">
      <p className={clsx("leading-none", { "text-emerald-500": catching })}>
        {!!toFront ? toFront : "+0.000"}
      </p>
      <p className="text-sm font-medium leading-none text-gray-500">
        {!!toLeader ? toLeader : "+0.000"}
      </p>
    </div>
  );
}
