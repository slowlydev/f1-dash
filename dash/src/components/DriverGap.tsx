import clsx from "clsx";

type Props = {
  toFront: string;
  toLeader: string;
  catching: boolean;
};

export default function DriverGap({ toFront, toLeader, catching }: Props) {
  return (
    <div className="place-self-start text-lg font-semibold">
      <p
        className={clsx("leading-none", {
          "text-emerald-500": catching,
          "text-gray-500": !toFront,
        })}
      >
        {!!toFront ? toFront : "-- ---"}
      </p>
      <p className="text-sm font-medium leading-none text-gray-500">
        {!!toLeader ? toLeader : "-- ---"}
      </p>
    </div>
  );
}
