interface Props {
  size?: number;
  className?: string;
  text?: string;
}

export default function LoadingSpinner({ size = 18, className = '', text }: Props) {
  return (
    <span
      className={['inline-flex items-center gap-2', className].join(' ')}
    >
      <svg
        className="animate-spin text-brand"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
      >
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeOpacity="0.18"
          strokeWidth="3"
        />
        <path
          d="M22 12a10 10 0 0 0-10-10"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      {text && (
        <span className="text-[13px] font-medium text-ink-muted">{text}</span>
      )}
    </span>
  );
}
