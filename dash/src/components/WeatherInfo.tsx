export default function WeatherInfo() {
  const stats = [
    { name: "Wind", stat: "71,897" },
    { name: "Track", stat: "58.16%" },
    { name: "Air", stat: "24.57%" },
    { name: "Humidity", stat: "24.57%" },
    { name: "Pressure", stat: "24.57%" },
    { name: "Rain", stat: "24.57%" },
  ];

  return (
    <dl className="mt-5 grid grid-cols-8">
      {stats.map((item) => (
        <div key={item.name} className="overflow-hidden px-4">
          <dt className="truncate text-sm font-medium text-gray-500">
            {item.name}
          </dt>
          <dd className="mt-1 text-3xl font-semibold text-white">
            {item.stat}
          </dd>
        </div>
      ))}
    </dl>
  );
}
