export function HeartButton({
  active,
  onChange,
}: {
  active: boolean;
  onChange: (newState: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!active)}
      className="relative w-12 h-12 flex items-center justify-center transition-transform duration-200 hover:scale-105"
    >
      <svg
        viewBox="0 0 24 24"
        fill={active ? "red" : "rgba(0, 0, 0, 0.5)"}
        stroke={active ? "none" : "white"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-10 h-10 transition-all duration-200"
      >
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    </button>
  );
}

export default HeartButton;
