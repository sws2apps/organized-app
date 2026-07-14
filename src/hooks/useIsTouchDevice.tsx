import { useMediaQuery } from '@mui/material';

/**
 * Detects touch-first devices (phones and tablets) by input capability rather
 * than screen size.
 *
 * A width breakpoint is the wrong tool here: a 12.9" iPad Pro has a
 * laptop-class viewport, so any width-based check would wrongly exclude it.
 * Instead we look at how the device is actually driven:
 *
 * - `pointer: coarse` — the primary pointer is imprecise (a finger), not a
 *   mouse or trackpad.
 * - `hover: none` — the primary input cannot hover.
 *
 * Both are true on phones and tablets (including large iPads) and false on
 * laptops and desktops, which report a fine, hover-capable pointer. This is the
 * standard, resolution-independent way to say "this is a touch device".
 *
 * @returns `true` on touch-first mobile devices (phones and tablets).
 */
const useIsTouchDevice = () => {
  return useMediaQuery('(hover: none) and (pointer: coarse)', { noSsr: true });
};

export default useIsTouchDevice;
