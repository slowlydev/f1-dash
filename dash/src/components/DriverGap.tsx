type Props = {
  toFront: string;
  toLeader: string;
};

export default function DriverGap({ toFront, toLeader }: Props) {
  return (
    <div className="text-lg font-semibold">
      <p>{toFront}</p>
      <p className="text-sm font-normal text-gray-500">LEAD: {toLeader}</p>
    </div>
  );
}
