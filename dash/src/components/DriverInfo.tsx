type Props = {
  laps: number;
  status: "OUT" | "RETIRED" | "STOPPED" | "PIT" | "PIT OUT" | "CUTOFF" | null;
};

export default function DriverInfo({ laps, status }: Props) {
  return (
    <div className="place-self-start text-lg font-semibold">
      <p className="leading-none">L {laps ?? 0}</p>
      <p className="text-sm font-medium leading-none text-gray-500">
        {status ?? "-"}
      </p>
    </div>
  );
}
