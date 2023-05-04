import clsx from "clsx";

type Props = {
  on: boolean;
  possible: boolean;
};

export default function DriverDRS({ on, possible }: Props) {
  const color = on
    ? "border-emerald-500 text-emerald-500"
    : "border-gray-500 text-gray-500";

  return (
    <span
      className={clsx(
        "text-md inline-flex items-center rounded-md border-2 px-2.5 py-0.5 font-semibold",
        {
          "border-gray-500 text-gray-500": !on && !possible,
          "border-gray-300 text-gray-300": !on && possible,
          "border-emerald-500 text-emerald-500": on && possible,
        }
      )}
    >
      DRS
    </span>
  );
}
