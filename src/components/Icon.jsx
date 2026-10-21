// Inline stroke icons lifted from the design mockup (24x24 viewBox).
const PATHS = {
  home: <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" />,
  briefcase: (
    <>
      <rect x="3" y="7.5" width="18" height="12.5" rx="3.2" />
      <path d="M8.5 7.5V6a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v1.5M3 13h18" />
    </>
  ),
  car: (
    <>
      <path d="M5.2 10.2 6.6 6.6A2 2 0 0 1 8.5 5.3h7a2 2 0 0 1 1.9 1.3l1.4 3.6" />
      <rect x="3" y="10.2" width="18" height="6.6" rx="2.4" />
      <circle cx="7.5" cy="13.5" r=".6" />
      <circle cx="16.5" cy="13.5" r=".6" />
      <path d="M6 16.8v2M18 16.8v2" />
    </>
  ),
  plane: (
    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
  ),
  file: <path d="M7 3h6.5L19 8.5V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2zM13.5 3v5.5H19M9 13h6M9 17h4" />,
  history: <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1L3.5 8.5M3.5 4v4.5H8M12 7.5V12l3 2" />,
  chart: <path d="M3.5 3.5v17h17M7.5 15l4-4.5 3 3 5-6" />,
  refresh: <path d="M20.5 12a8.5 8.5 0 0 1-14.6 5.9L3.5 15.5M3.5 12a8.5 8.5 0 0 1 14.6-5.9l2.4 2.4M20.5 4v4.5H16M3.5 20v-4.5H8" />,
  check: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12.3 2.8 2.8L16.2 9.5" />
    </>
  ),
  card: (
    <>
      <rect x="2.5" y="6" width="19" height="12" rx="3" />
      <circle cx="12" cy="12" r="2.6" />
    </>
  ),
  pin: (
    <>
      <path d="M19.5 10.2c0 5.6-7.5 11-7.5 11s-7.5-5.4-7.5-11a7.5 7.5 0 0 1 15 0z" />
      <circle cx="12" cy="10.2" r="2.6" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="3" />
      <path d="M6.5 18.5c1.2-2.4 3.2-3.5 5.5-3.5s4.3 1.1 5.5 3.5" />
    </>
  ),
  bell: <path d="M18 9.5a6 6 0 1 0-12 0c0 6-2.5 7.5-2.5 7.5h17S18 15.5 18 9.5zM10 20.5a2.2 2.2 0 0 0 4 0" />,
  sliders: (
    <>
      <path d="M4 7h8M18 7h2M4 17h2M12 17h8" />
      <circle cx="15" cy="7" r="2.4" />
      <circle cx="9" cy="17" r="2.4" />
    </>
  ),
  link: <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" />,
  sidebar: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="4" />
      <path d="M9.5 4.5v15" />
    </>
  ),
  logout: <path d="M9.5 3.5H6a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h3.5M15.5 16.5 20 12l-4.5-4.5M20 12H9.5" />,
  upload: <path d="M12 15V3.5M8 7l4-4 4 4M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7" />,
  bolt: <path d="M13 2.5 4.5 13.5H11l-1 8 8.5-11H12z" />,
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.9-4.9" />
    </>
  ),
  filter: <path d="M3.5 6.5h17M7 12h10M10.5 17.5h3" />,
  box: <path d="M21 8 12 3 3 8v8l9 5 9-5zM3 8l9 5 9-5M12 13v8" />,
  chevrons: <path d="m8 9.5 4-4 4 4M8 14.5l4 4 4-4" />,
  chevl: <path d="m14.5 6-6 6 6 6" />,
  chevr: <path d="m9.5 6 6 6-6 6" />,
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="3.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  send: <path d="M20.5 3.5 10 14M20.5 3.5 14 20.5l-4-6.5-6.5-4z" />,
  more: (
    <>
      <circle cx="5.5" cy="12" r="1.2" />
      <circle cx="12" cy="12" r="1.2" />
      <circle cx="18.5" cy="12" r="1.2" />
    </>
  ),
  close: <path d="M6 6l12 12M18 6 6 18" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.8v.4" />
    </>
  ),
};

export default function Icon({ name, style, className = 'i' }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" aria-hidden="true">
      {PATHS[name]}
    </svg>
  );
}
