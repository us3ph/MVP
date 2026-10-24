import { useEffect, useState } from 'react';

// Reference size of the design; on larger screens the UI is scaled up (max 1.5x) to keep the mockup's proportions.
const DESIGN_W = 1440;
const DESIGN_H = 900;
const MAX_SCALE = 1.5;

// The window always fills the viewport. The scale is 1 on laptops and grows gently on big monitors.
export default function useFillScale() {
  const compute = () => {
    const scale = Math.min(Math.max(Math.min(window.innerWidth / DESIGN_W, window.innerHeight / DESIGN_H), 1), MAX_SCALE);
    return { scale, width: window.innerWidth / scale, height: window.innerHeight / scale };
  };
  const [box, setBox] = useState(compute);
  useEffect(() => {
    const onResize = () => setBox(compute());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  return box;
}
