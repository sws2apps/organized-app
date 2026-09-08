import { Box } from '@mui/material';
import { useScrollFade } from '@hooks/index';
import { ScrollAreaProps } from './index.types';

/**
 * A scrollable region whose content dissolves at the edges it scrolls past,
 * the same way a dialog's own content does.
 *
 * Use it for a list or panel that scrolls inside something else, where the
 * surrounding scroll area cannot tell that its content is cut off.
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
