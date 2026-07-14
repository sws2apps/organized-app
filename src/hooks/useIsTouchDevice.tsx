import { useMediaQuery } from '@mui/material';

/**
 * True on touch-first devices (phones and tablets), detected by input
 * capability rather than width — so large iPads with a laptop-class viewport
 * still count.
 */
const useIsTouchDevice = () => {
  return useMediaQuery('(hover: none) and (pointer: coarse)', { noSsr: true });
};

export default useIsTouchDevice;
