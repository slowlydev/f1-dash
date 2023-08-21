import clsx from "clsx";

type Props = {
  connected: boolean;
  defaultHidden: boolean;
};

export default function ConnectionStatus({ connected, defaultHidden }: Props) {
  return (
    <div
      className={clsx(
        defaultHidden ? "hidden sm:block" : "block sm:hidden",
        "h-4 w-4 rounded-full",
        connected ? "bg-emerald-500" : "bg-red-500"
      )}
    />
  );
}
