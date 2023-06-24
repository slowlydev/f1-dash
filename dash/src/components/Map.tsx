import { useEffect, useState } from "react";
import { DriverPositionBatch } from "../types/positions.type";
import { SessionInfo } from "../types/session.type";
import { MapType } from "../types/map.type";

type Props = {
  circuitKey: SessionInfo["circuitKey"] | undefined;
  positionBatches: DriverPositionBatch[] | undefined;
};

const space = 1000;

export default function Map({ circuitKey, positionBatches }: Props) {
  const [points, setPoints] = useState<null | { x: number; y: number }[]>(null);

  const [[minX, minY, widthX, widthY], setBounds] = useState<(null | number)[]>(
    [null, null, null, null]
  );

  const positions = positionBatches
    ? positionBatches.sort((a, b) => (a.utc > b.utc ? 0 : 1))[0].positions
    : null;

  useEffect(() => {
    (async () => {
      if (!circuitKey) return;
      const mapReq = await fetch(`/api/map/${circuitKey}`);
      const mapJson: MapType = await mapReq.json();

      const cMinX = Math.min(...mapJson.x.map((xItem) => xItem)) - space;
      const cMinY = Math.min(...mapJson.y.map((yItem) => yItem)) - space;
      const cWidthX =
        Math.max(...mapJson.x.map((xItem) => xItem)) - cMinX + space * 2;
      const cWidthY =
        Math.max(...mapJson.y.map((yItem) => yItem)) - cMinY + space * 2;

      setBounds([cMinX, cMinY, cWidthX, cWidthY]);

      setPoints(
        mapJson.x.map((xItem, index) => ({ x: xItem, y: mapJson.y[index] }))
      );
    })();
  }, [circuitKey]);

  // TODO use whole batch?? -> no

  if (!minX || !minY || !widthX || !widthY) return null;

  return (
    <svg
      viewBox={`${minX} ${minY} ${widthX} ${widthY}`}
      className="h-full w-full"
    >
      {points && (
        <path
          stroke="white"
          strokeWidth={100}
          strokeLinejoin="round"
          fill="transparent"
          d={`M${points[0].x},${points[0].y} ${points
            .map((point) => `L${point.x},${point.y}`)
            .join(" ")}`}
        />
      )}

      {positions &&
        positions.map((pos) => (
          <g key={`map.driver.${pos.driverNr}`}>
            <circle
              cx={pos.x}
              cy={pos.y}
              r={120}
              fill={`#${pos.teamColor}`}
              style={{ transition: "1s linear" }}
            />
            <text
              x={0}
              y={0}
              fontWeight="bold"
              fontSize={120 * 3}
              fill={`#${pos.teamColor}`}
              style={{
                transition: "1s linear",
                translate: `${pos.x + 150}px ${pos.y - 120}px`,
              }}
            >
              {pos.short}
            </text>
          </g>
        ))}
    </svg>
  );
}
