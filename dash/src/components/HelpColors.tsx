import React from "react";

export default function HelpColors() {
  return (
    <div>
      <h3 className="mt-4 text-2xl font-semibold">Colors and their meaning</h3>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-yellow-500" />
          <p>No improvement to PB (normal)</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-emerald-500" />
          <p>Personal Best</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-indigo-500" />
          <p>Overall Best</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-gray-500" />
          <p>Last Value or Empty (sectors, laptime only)</p>
        </div>
      </div>
    </div>
  );
}
