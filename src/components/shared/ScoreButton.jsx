import { Plus, Minus } from "lucide-react";

const SIZE_CLASSES = {
  sm: "w-10 h-10 rounded-xl",
  md: "w-12 h-12 rounded-xl",
  lg: "w-12 h-12 md:w-14 md:h-14 rounded-2xl",
};

const ICON_SIZES = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-5 h-5 md:w-6 md:h-6",
};

/**
 * Reusable score increment/decrement button.
 * Eliminates repeated button styling across scoreboards.
 */
export function ScoreButton({ type = "increment", onClick, size = "lg", id }) {
  const Icon = type === "increment" ? Plus : Minus;

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center ${SIZE_CLASSES[size]} bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-lg shadow-red-400/20 transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer`}
      id={id}
    >
      <Icon className={ICON_SIZES[size]} />
    </button>
  );
}
