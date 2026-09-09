import { Box } from '@mui/material';
import { useScrollFade } from '@hooks/index';
import { ScrollAreaProps } from './index.types';

/**
 * A list or panel that scrolls inside something else, dissolving at the edges
 * it scrolls past: the surrounding scroll area cannot tell that it is cut off.
 */
const ScrollArea = ({ children, sx, ...props }: ScrollAreaProps) => {
  const ref = useScrollFade();

  return (
    <Box
      ref={ref}
      className="scroll-fade-y"
      sx={{ overflowY: 'auto', ...sx }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default ScrollArea;
