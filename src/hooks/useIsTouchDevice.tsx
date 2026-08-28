import { useMediaQuery } from '@mui/material';

// True on touch-first devices (input capability, not width — includes big iPads).
const useIsTouchDevice = () => {
  return useMediaQuery('(hover: none) and (pointer: coarse)', { noSsr: true });
};

export default useIsTouchDevice;
