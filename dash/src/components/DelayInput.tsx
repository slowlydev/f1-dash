import { FormEvent, useState } from "react";

type Props = {
  setDebouncedDelay: (delay: number) => void;
};

export default function DelayInput({ setDebouncedDelay }: Props) {
  const [delay, setDelay] = useState("");

  const updateDebounced = () => {
    const nextDelay = parseInt(delay ?? "0");
    if (nextDelay < 0) return;
    setDebouncedDelay(nextDelay);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    updateDebounced();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={delay}
        onChange={(e) => setDelay(e.target.value)}
        onBlur={() => updateDebounced()}
        placeholder="delay"
        className="block w-20 rounded-lg border-[1px] border-gray-500 bg-zinc-900 py-1 text-center font-mono"
      />
    </form>
  );
}
