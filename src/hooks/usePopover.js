import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const GAP = 6; // px between the trigger and the popover (same as the CSS default)
const MARGIN = 8; // px kept free along the screen edges

// Pins the open popover (the `.pop` child of the `.pop-wrap`) to the screen next to its trigger, so a
// scrolling card, table or dialog around it can no longer clip it: a table with one or two rows used
// to cut the « Type de la mission » list short and make the card scroll. The popover opens below the
// trigger, or above it when there is more room there, and its height is capped to the room left.
// The app window is scaled (useFillScale) and dialog overlays have their own positioning context, so
// a probe measures where `position: fixed` puts things instead of assuming the viewport.
function place(wrap) {
  const pop = wrap.querySelector(':scope > .pop');
  if (!pop) return;

  const probe = document.createElement('div');
  probe.style.cssText = 'position:fixed;left:0;top:0;width:100px;height:0;visibility:hidden;pointer-events:none';
  wrap.appendChild(probe);
  const origin = probe.getBoundingClientRect();
  probe.remove();
  const scale = origin.width / 100 || 1;

  // The stylesheet's own limits, read once before the inline styles below override them.
  if (!pop.dataset.cssMax) {
    const cs = getComputedStyle(pop);
    pop.dataset.cssMax = String(parseFloat(cs.maxHeight) || Infinity);
    pop.dataset.cssMin = String(cs.minWidth.endsWith('px') ? parseFloat(cs.minWidth) : 0);
  }
  const cssMax = Number(pop.dataset.cssMax);
  const cssMin = Number(pop.dataset.cssMin);

  const anchor = wrap.getBoundingClientRect();
  pop.style.position = 'fixed';
  pop.style.right = 'auto';
  pop.style.bottom = 'auto';
  pop.style.minWidth = `${Math.max(cssMin, anchor.width / scale)}px`;

  // Sizes in the app's own (unscaled) pixels; the borders are not part of scrollHeight.
  const borders = pop.offsetHeight - pop.clientHeight;
  const height = Math.min(pop.scrollHeight + borders, cssMax);
  const width = pop.offsetWidth;
  const below = (window.innerHeight - MARGIN - anchor.bottom) / scale - GAP;
  const above = (anchor.top - MARGIN) / scale - GAP;
  const up = height > below && above > below;
  const room = Math.max(up ? above : below, 48);
  const shown = Math.min(height, room);
  pop.style.maxHeight = `${Math.min(cssMax, room)}px`;

  const alignRight = pop.classList.contains('pop-right');
  const top = up ? anchor.top - (GAP + shown) * scale : anchor.bottom + GAP * scale;
  let left = alignRight ? anchor.right - width * scale : anchor.left;
  left = Math.min(Math.max(left, MARGIN), window.innerWidth - MARGIN - width * scale);
  pop.style.left = `${(left - origin.left) / scale}px`;
  pop.style.top = `${(top - origin.top) / scale}px`;
  pop.style.transformOrigin = `${up ? 'bottom' : 'top'} ${alignRight ? 'right' : 'left'}`;
}

// Open/close state for a popover anchored to `ref`; closes on outside click or Escape.
export default function usePopover() {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    // Escape closes the popover only; it must not reach the dialog that may contain it.
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation();
      setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Position on every render while open (the list can change, e.g. while searching).
  useLayoutEffect(() => {
    if (open && ref.current) place(ref.current);
  });

  // Follow the trigger when the page or a card scrolls, and when the window is resized. Scrolling
  // inside the popover's own list is ignored.
  useEffect(() => {
    if (!open) return undefined;
    const update = (e) => {
      if (!ref.current) return;
      if (e && e.type === 'scroll' && e.target instanceof Node && ref.current.contains(e.target)) return;
      place(ref.current);
    };
    document.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      document.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [open]);

  return { ref, open, setOpen };
}
