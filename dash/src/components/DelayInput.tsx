import { useState } from "react";

type Props = {
  setDebouncedDelay: (delay: number) => void;
};

export default function DelayInput({ setDebouncedDelay }: Props) {
  const [delay, setDelay] = useState("0");

  return (
    <div className="sm:mr-2">
      <input
        value={delay}
        onChange={(e) => setDelay(e.target.value)}
        onBlur={() => setDebouncedDelay(parseInt(delay))}
        placeholder="delay"
        className="block w-20 rounded-lg border-[1px] border-gray-500 bg-zinc-900 py-1 text-center font-mono"
      />
    </div>
  );
}
