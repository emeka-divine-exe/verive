interface VerifiedBadgeProps {
  size?: number
  color?: string
}

/**
 * The standard verified badge — same visual language as Twitter/X, Instagram, TikTok.
 * Filled circle with a white checkmark stroke inside.
 * Color defaults to Verivent primary purple.
 */
export function VerifiedBadge({ size = 16, color = '#7B3FE4' }: VerifiedBadgeProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Verified"
      style={{ flexShrink: 0 }}
    >
      {/* Outer filled circle */}
      <circle cx="10" cy="10" r="10" fill={color} />
      {/* White checkmark — same proportions as Twitter/Instagram badge */}
      <path
        d="M5.5 10.5L8.3 13.3L14.5 7"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
