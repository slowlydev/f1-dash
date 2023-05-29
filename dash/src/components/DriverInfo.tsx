type Props = {
  laps: number;
  status: "OUT" | "RETIRED" | "STOPPED" | "PIT" | "PIT OUT" | null;
};

export default function DriverInfo({ laps, status }: Props) {
  return (
    <div className="ml-2 text-lg font-semibold">
      <p className="leading-none">{laps}</p>
      <p className="text-sm font-medium leading-none text-gray-500">{status}</p>
    </div>
  );
}
