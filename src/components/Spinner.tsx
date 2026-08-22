// Spinner.tsx

export function Spinner({ size = 48 }: { size?: number }) {
  return (
    <svg
      className="spinner"
      width={size}
      height={size}
      viewBox="0 0 50 50"
      aria-label="Loading"
      role="status"
    >
      <circle
        className="spinner__track"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="4"
      />
      <circle
        className="spinner__arc"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <style>{`
        .spinner {
          animation: spinner-rotate 1s linear infinite;
        }
        .spinner__track {
          stroke: var(--border-subtle);
        }
        .spinner__arc {
          stroke: var(--purple-light, #b674ff);
          stroke-dasharray: 90;
          stroke-dashoffset: 60;
        }
        @keyframes spinner-rotate {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </svg>
  );
}