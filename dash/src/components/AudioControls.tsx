import { AnimatePresence, LayoutGroup, motion } from "framer-motion";

type Props = {
  playing: boolean;
  onClick: () => void;
};

export default function AudioControls({ playing, onClick }: Props) {
  const variants = {
    initial: { opacity: 0, scale: 0.5 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.5 },
  };

  return (
    <AnimatePresence>
      <div
        className="flex h-8 w-8 cursor-pointer items-center justify-center"
        onClick={onClick}
      >
        {!playing && (
          <motion.svg
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M5 3L19 12L5 21V3Z"
              fill="white"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )}

        {playing && (
          <motion.svg
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M10 4H6V20H10V4Z"
              fill="white"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <motion.path
              d="M18 4H14V20H18V4Z"
              fill="white"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )}
      </div>
    </AnimatePresence>
  );
}
