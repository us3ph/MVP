import './SnakeAmpersand.css';

// A single-stroke ampersand that draws itself like a snake: the stroke retracts to its starting
// point, then slithers along the path until the full « & » is formed. The path is traced over the
// Open Sauce One glyph: from the arm (upper right) down to the left and round the bottom bowl, up the
// spine and over the top bowl to the right, back down to the left through the centre, then right
// down the leg. It runs on the TravelLogo 40 s clock (see TravelLogo.css) and
// redraws as the car pulls in (43–49 %) and as the plane lands (92–100 %).
export default function SnakeAmpersand({ className = '', animated = true, ...rest }) {
  return (
    <span
      className={`snake-amp${animated ? ' snake-amp--animated' : ''}${className ? ` ${className}` : ''}`}
      role="img"
      aria-label="&"
      {...rest}
    >
      <svg viewBox="0 0 100 120" aria-hidden="true" focusable="false">
        <path
          d="M78 62 C76.7 64.7 73.0 72.2 70 78 C67.0 83.8 64.0 92.0 60 97 C56.0 102.0 51.7 106.8 46 108 C40.3 109.2 31.3 107.3 26 104 C20.7 100.7 15.0 93.7 14 88 C13.0 82.3 16.8 74.8 20 70 C23.2 65.2 32.7 63.0 33 59 C33.3 55.0 23.8 50.8 22 46 C20.2 41.2 20.0 35.2 22 30 C24.0 24.8 29.7 17.7 34 15 C38.3 12.3 43.5 12.3 48 14 C52.5 15.7 59.0 20.5 61 25 C63.0 29.5 62.2 35.8 60 41 C57.8 46.2 48.3 50.8 48 56 C47.7 61.2 54.3 66.3 58 72 C61.7 77.7 65.7 84.0 70 90 C74.3 96.0 81.7 105.0 84 108"
          pathLength="1"
        />
      </svg>
    </span>
  );
}
