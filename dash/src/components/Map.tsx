import { useEffect, useState } from "react";
import { DriverPosition, DriverPositionBatch } from "../types/positions.type";
import { SessionInfo } from "../types/session.type";
import { MapType } from "../types/map.type";
import { utc } from "moment";
import clsx from "clsx";

// This is basically fearlessly copied from
// https://github.com/tdjsnelling/monaco

type Props = {
  circuitKey: SessionInfo["circuitKey"] | undefined;
  positionBatches: DriverPositionBatch[] | undefined;
};

const space = 1000;

const rad = (deg: number) => deg * (Math.PI / 180);
const deg = (rad: number) => rad / (Math.PI / 180);

const rotate = (x: number, y: number, a: number, px: number, py: number) => {
  const c = Math.cos(rad(a));
  const s = Math.sin(rad(a));

  x -= px;
  y -= py;

  const newX = x * c - y * s;
  const newY = y * c + x * s;

  return { y: newX + px, x: newY + py };
};

const rotationFIX = 90;

export default function Map({ circuitKey, positionBatches }: Props) {
  const [points, setPoints] = useState<null | { x: number; y: number }[]>(null);
  const [rotation, setRotation] = useState<number>(rotationFIX);
  const [ogPoints, setOgPoints] = useState<null | { x: number; y: number }[]>(
    null
  );

  const [[minX, minY, widthX, widthY], setBounds] = useState<(null | number)[]>(
    [null, null, null, null]
  );

  const positions = positionBatches
    ? positionBatches.sort((a, b) => utc(b.utc).diff(utc(a.utc)))[0].positions
    : null;

  useEffect(() => {
    (async () => {
      if (!circuitKey) return;
      const mapReq = await fetch(`/api/map/${circuitKey}`);
      const mapJson: MapType = await mapReq.json();

      const centerX = (Math.max(...mapJson.x) - Math.min(...mapJson.x)) / 2;
      const centerY = (Math.max(...mapJson.y) - Math.min(...mapJson.y)) / 2;

      const rotatedPoints = mapJson.x.map((x, index) =>
        rotate(x, mapJson.y[index], rotationFIX, centerX, centerY)
      );

      const pointsX = rotatedPoints.map((item) => item.x);
      const pointsY = rotatedPoints.map((item) => item.y);

      const cMinX = Math.min(...pointsX) - space;
      const cMinY = Math.min(...pointsY) - space;
      const cWidthX = Math.max(...pointsX) - cMinX + space * 2;
      const cWidthY = Math.max(...pointsY) - cMinY + space * 2;

      setBounds([cMinX, cMinY, cWidthX, cWidthY]);
      setPoints(rotatedPoints);
      setRotation(rotationFIX);
      setOgPoints(
        mapJson.x.map((xItem, index) => ({ x: xItem, y: mapJson.y[index] }))
      );
    })();
  }, [circuitKey]);

  if (!minX || !minY || !widthX || !widthY) return null;

  return (
    <svg
      viewBox={`${minX} ${minY} ${widthX} ${widthY}`}
      className="h-full w-full"
    >
      {points && (
        <>
          <path
            className="stroke-slate-700"
            strokeWidth={300}
            strokeLinejoin="round"
            fill="transparent"
            d={`M${points[0].x},${points[0].y} ${points
              .map((point) => `L${point.x},${point.y}`)
              .join(" ")}`}
          />

          <path
            stroke="white"
            strokeWidth={60}
            strokeLinejoin="round"
            fill="transparent"
            d={`M${points[0].x},${points[0].y} ${points
              .map((point) => `L${point.x},${point.y}`)
              .join(" ")}`}
          />
        </>
      )}

      {ogPoints &&
        positions &&
        positions.map((pos) => {
          // TODO move to backend
          const xS = ogPoints.map((item) => item.x);
          const yS = ogPoints.map((item) => item.y);

          const rotatedPos = rotate(
            pos.x,
            pos.y,
            rotationFIX,
            (Math.max(...xS) - Math.min(...xS)) / 2,
            (Math.max(...yS) - Math.min(...yS)) / 2
          );

          const out =
            pos.status === "OUT" ||
            pos.status === "RETIRED" ||
            pos.status === "STOPPED";

          return (
            <g
              key={`map.driver.${pos.driverNr}`}
              className={clsx({ "opacity-70": out })}
            >
              <circle
                cx={rotatedPos.x}
                cy={rotatedPos.y}
                r={120}
                fill={`#${pos.teamColor}`}
                style={{ transition: "0.5s linear" }}
              />
              <text
                x={0}
                y={0}
                fontWeight="bold"
                fontSize={120 * 3}
                fill={`#${pos.teamColor}`}
                style={{
                  transition: "0.5s linear",
                  translate: `${rotatedPos.x + 150}px ${rotatedPos.y - 120}px`,
                }}
              >
                {pos.short}
              </text>
            </g>
          );
        })}
    </svg>
  );
}
