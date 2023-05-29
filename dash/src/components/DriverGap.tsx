type Props = {
  toFront: string;
  toLeader: string;
};

export default function DriverGap({ toFront, toLeader }: Props) {
  return (
    <div className="ml-2 text-lg font-semibold">
      <p className="leading-none">{toFront}</p>
      <p className="text-sm font-medium leading-none text-gray-500">
        {toLeader}
      </p>
    </div>
  );
}
