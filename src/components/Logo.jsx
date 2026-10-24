import { useId } from 'react';

// Travel & Expense mark: an open orbit, an ascending arrow breaking out of it, a thin tilted orbital
// and a satellite dot. `tone="color"` draws the brand gradient, `tone="white"` a white version for
// dark or tinted backgrounds.
export default function Logo({ size = 40, tone = 'color', className }) {
  const id = useId();
  const grad = `${id}-g`;
  const glow = `${id}-glow`;
  const paint = tone === 'white' ? '#fff' : `url(#${grad})`;
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className} aria-hidden="true">
      <defs>
        <linearGradient id={grad} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#e8341f" />
          <stop offset="0.55" stopColor="#ff7a3c" />
          <stop offset="1" stopColor="#ffc46b" />
        </linearGradient>
        <filter id={glow} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* orbit ring, open at the top right where the arrow leaves it */}
      <circle cx="32" cy="32" r="25" fill="none" stroke={paint} strokeWidth="3" strokeLinecap="round" strokeDasharray="112 46" transform="rotate(-12 32 32)" opacity={tone === 'white' ? 0.92 : 1} />
      {/* thin tilted orbital */}
      <ellipse cx="32" cy="32" rx="31" ry="10" fill="none" stroke={paint} strokeWidth="1.1" opacity="0.4" transform="rotate(-32 32 32)" />
      {/* ascending arrow: fading trail, then the glowing head */}
      <path d="M13 51 L25 39" stroke={paint} strokeWidth="4" strokeLinecap="round" opacity="0.3" />
      <path d="M22 42 L44 20" stroke={paint} strokeWidth="4.6" strokeLinecap="round" filter={`url(#${glow})`} />
      <path d="M30 19.5 H44.5 V34" fill="none" stroke={paint} strokeWidth="4.6" strokeLinecap="round" strokeLinejoin="round" filter={`url(#${glow})`} />
      {/* satellite */}
      <circle cx="53" cy="12" r="3.4" fill={paint} filter={`url(#${glow})`} />
      <circle cx="53" cy="12" r="6.5" fill="none" stroke={paint} strokeWidth="1" opacity="0.35" />
    </svg>
  );
}
