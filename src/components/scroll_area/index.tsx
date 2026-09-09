import { Box } from '@mui/material';
import { useScrollFade } from '@hooks/index';
import { ScrollAreaProps } from './index.types';

/**
 * A list or panel that scrolls inside something else, dissolving at the edges
 * it scrolls past: the surrounding scroll area cannot tell that it is cut off.
 */
const ScrollArea = ({
  children,
  sx,
  className,
  ref,
  ...props
}: ScrollAreaProps) => {
  const fadeRef = useScrollFade();

  return (
    <Box
      {...props}
      ref={(el: HTMLDivElement | null) => {
        fadeRef(el);

        if (typeof ref === 'function') ref(el);
        else if (ref) ref.current = el;
      }}
      className={['scroll-fade-y', className].filter(Boolean).join(' ')}
      sx={{ overflowY: 'auto', ...sx }}
    >
      {children}
    </Box>
  );
};

export default ScrollArea;
