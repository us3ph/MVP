import './TravelLogo.css';

// Travel & Expense logo mark (a boarding pass with a plane taking off), from the design's Travel.svg.
// The artwork is cropped to its own bounds (the original file had a very wide empty viewBox) and
// fills with currentColor, so it takes the text colour of wherever it is placed. When `animated`,
// the plane and a car take turns on the ticket, 15 s each: the plane takes off, the car drives in
// and parks, drives away again, and the plane glides back to its place. The car is a simple
// side-view silhouette drawn in a 100 × 44 box and placed where the plane rests.
export default function TravelLogo({ className = '', title, animated = true, ...rest }) {
  return (
    <svg
      viewBox="271.6 5.4 168.3 93.4"
      fill="currentColor"
      className={`travel-logo${animated ? ' travel-logo--animated' : ''}${className ? ` ${className}` : ''}`}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : 'true'}
      focusable="false"
      {...rest}
    >
      {title && <title>{title}</title>}
      <path d="m207.6 8.7c-.3 1-2.1 9-4.1 17.8-1.9 8.7-4.1 16.5-4.8 17.3-.8.7-3.9 1.6-7.1 1.9-3.1.3-5.9 1-6.2 1.5s.7 2.7 2.3 4.9c1.5 2.2 3.2 4.6 3.7 5.3.7 1-.2 2.7-2.7 5.8-2 2.5-3.7 4.8-3.7 5.3 0 .4 1.6 2.9 3.6 5.7l3.6 4.9-2.8 4c-1.6 2.2-3.3 4.6-3.8 5.3-.7 1 .2 2.9 2.8 6.5l3.8 5.1-3.6 4.9c-2 2.7-3.6 5.4-3.6 6 0 .8 31.5 1.1 117 1.1 114.6 0 117 0 118-1.9 1.4-2.6 1.3-19.8-.1-20.7-2.2-1.3-3.3 1.7-3.2 8.9 0 3.9-.4 7.8-.9 8.5-.8.9-24.3 1.2-111.4 1.2-115.7 0-113.8.1-108.9-4 2.4-2 1.8-5.9-1.5-9.7-1.7-1.8-3-3.7-3-4.2 0-.4 1.6-2.9 3.4-5.6 1.9-2.7 3.2-5.3 2.9-5.9-.4-.6-2-3-3.6-5.3l-3-4.2 3.4-5.2c3.2-5.1 3.3-5.2 1.6-8.1-.9-1.6-1.7-3.5-1.7-4.1 0-.9 18.6-1.2 75.4-1.3 41.4-.1 76.6-.4 78.1-.8 2.2-.6 2.5-.9 1.5-2.1-1.1-1.3-11.4-1.5-73.2-1.5h-72l.6-2.8c2.1-8.3 2.8-10.2 4.1-10.2.7 0 11.2 2 23.2 4.5s22.7 4.4 23.8 4.3c1.1-.2 2-1 2-1.8 0-1.7-2.1-2.3-29.5-8.1-10.7-2.2-19.7-4.2-19.8-4.4-.2-.2.4-3.8 1.3-7.9 1.3-5.9 2.1-7.6 3.4-7.6 1 0 22.7 4.5 48.2 9.9 80.8 17.3 98.6 20.8 100 19.3.9-.8 1-1.5.3-2.2-.5-.5-12.6-3.4-26.9-6.4-36.8-7.7-72.9-15.4-80.5-17.1-20.7-4.6-40.4-8.5-42.9-8.5-1.9 0-3.2.6-3.5 1.7z" transform="translate(0.27 -16.26) matrix(0.6214 0 0 0.6214 159.39 42.4)"/>
      <g className="travel-logo__plane">
        <path d="M430.2 8.7c-1.2 0.2 -6 4 -10.7 8.4l-8.4 8l-21.1 -2.2c-21 -2.1 -21.2 -2.2 -23.8 -0.2c-1.4 1 -2.7 2.3 -2.9 2.9c-0.1 0.5 6.9 4 15.7 7.8c8.8 3.9 16 7.3 16 7.7s-2.6 3.2 -5.7 6.2l-5.8 5.5l-6.5 -0.5c-5.6 -0.5 -6.7 -0.3 -8.3 1.5c-1.7 1.9 -1.6 2 5.7 5.5c7.5 3.5 7.6 3.7 11.3 11.1l3.7 7.6l2.2 -2.1c1.9 -1.8 2.1 -2.8 1.7 -8.7l-0.5 -6.7l5.6 -5.4c3 -3 5.7 -5.3 5.9 -5c0.3 0.2 3.5 7.1 7.2 15.4c3.7 8.2 7 15.4 7.2 15.8c0.3 0.5 1.8 -0.4 3.4 -1.9c2.1 -2 2.7 -3.3 2.3 -5.3c-0.2 -1.4 -1.3 -11.2 -2.3 -21.6l-2 -19l7.9 -8.1c7.9 -8 10.2 -12.3 8.3 -15.3c-1.1 -1.7 -2.6 -2.1 -6.1 -1.4z"/>
      </g>
      <g className="travel-logo__car">
        <g transform="translate(360 42) scale(0.78)">
          <path
            fillRule="evenodd"
            d="M3 36H13.5A10.5 10.5 0 0 1 34.5 36H65.5A10.5 10.5 0 0 1 86.5 36H97Q100 36 100 33V26Q100 21 95 20L78 18L64 6Q62 4 58 4H34Q30 4 27 7L15 19L5 21Q0 22 0 27V33Q0 36 3 36ZM31 8H53V17H23ZM58 8H65L74 17H58ZM24 28.5A7.5 7.5 0 1 0 24.01 28.5ZM24 33A3 3 0 1 1 23.99 33ZM76 28.5A7.5 7.5 0 1 0 76.01 28.5ZM76 33A3 3 0 1 1 75.99 33Z"
          />
        </g>
      </g>
      <g className="travel-logo__trail">
        <path d="M372 88c-1.2 0.7 -1.2 1.2 -0.2 2.2c0.9 0.9 6 1.4 17.5 1.6c17.6 0.4 24.9 -0.7 22.6 -3.4c-0.9 -1.1 -4.8 -1.4 -19.8 -1.4c-10.2 0 -19.3 0.5 -20.1 1z" transform="translate(-0.4 1.48) matrix(0.7662 0 0 0.7662 94.97 8.88)"/>
        <path d="M372.2 99.2c-0.8 0.8 -0.9 1.5 -0.1 2.5c1.6 1.9 28.2 1.9 29.8 0c0.8 -1 0.7 -1.7 -0.1 -2.5c-1.7 -1.7 -27.9 -1.7 -29.6 0z" transform="matrix(0.7102 0 0 0.7102 124.47 13.79)"/>
      </g>
    </svg>
  );
}
