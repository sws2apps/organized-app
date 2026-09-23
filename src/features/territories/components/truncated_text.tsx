import { ReactElement, useEffect, useRef, useState } from 'react';
import { Stack } from '@mui/material';
import { Typography } from '@components/index';
import Tooltip from '@components/tooltip';
import { CustomClassName } from '@definition/app';

const TruncatedText = ({
  text,
  tooltip,
  icon,
  className = 'body-regular',
  color = 'var(--black)',
}: {
  text: string;
  tooltip?: string;
  icon?: ReactElement;
  className?: CustomClassName;
  color?: string;
}) => {
  const row = useRef<HTMLDivElement>(null);

  const [clipped, setClipped] = useState(false);

  useEffect(() => {
    const element = row.current;
    if (!element) return;

    const measure = () => {
      const label = element.querySelector('p');

      setClipped(!!label && label.scrollWidth > label.clientWidth + 1);
    };

    const frame = requestAnimationFrame(measure);

    const observer = new ResizeObserver(measure);
    observer.observe(element);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [text]);

  return (
    <Tooltip title={tooltip ?? text} followCursor show={clipped}>
      <Stack
        ref={row}
        direction="row"
        spacing="4px"
        sx={{ alignItems: 'center', minWidth: 0 }}
      >
        {icon}
        <Typography className={className} color={color} noWrap>
          {text}
        </Typography>
      </Stack>
    </Tooltip>
  );
};

export default TruncatedText;
