import { useState } from "react";

type Props = {
  setDebouncedDelay: (delay: number) => void;
};

export default function DelayInput({ setDebouncedDelay }: Props) {
  const [delay, setDelay] = useState("0");

  return (
    <div className="flex">
      <input
        value={delay}
        onChange={(e) => setDelay(e.target.value)}
        onBlur={() => setDebouncedDelay(parseInt(delay))}
        placeholder="delay in seconds"
        className="block rounded-l-md border-0 py-1.5 pl-4 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
      />

      <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
        Seconds delay
      </span>
    </div>
  );
}
