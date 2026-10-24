import { Box } from '@mui/material';
import Typography from '@components/typography';
import { DetailRowProps } from '@components/detail_row/index.types';

/** Aligned icon and flexible content, including wrapped names, links and notes. */
const DetailRow = ({
  icon,
  label,
  children,
  className = 'body-regular',
  color = 'var(--black)',
  preserveWhitespace = false,
}: DetailRowProps) => (
  <Box
    className="detail-row"
    role={label ? 'group' : undefined}
    aria-label={label}
    sx={{
      display: 'grid',
      gridTemplateColumns: 'var(--icon-size) minmax(0, 1fr)',
      alignItems: 'start',
      gap: '8px',
      minWidth: 0,
    }}
  >
    <Box
      aria-hidden
      sx={{
        display: 'flex',
        color: 'var(--grey-400)',
        '& > svg': { width: 'var(--icon-size)', height: 'var(--icon-size)' },
      }}
    >
      {icon}
    </Box>
    <Typography
      component="div"
      className={className}
      color={color}
      sx={{
        minWidth: 0,
        overflowWrap: 'anywhere',
        whiteSpace: preserveWhitespace ? 'pre-wrap' : 'normal',
      }}
    >
      {children}
    </Typography>
  </Box>
);

export default DetailRow;
