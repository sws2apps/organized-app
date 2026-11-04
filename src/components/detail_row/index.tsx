import { Box } from '@mui/material';
import Typography from '@components/typography';
import { DetailRowProps } from '@components/detail_row/index.types';

/** One shared first-line alignment for values with or without an icon. */
const DetailRow = ({
  icon,
  label,
  children,
  className = 'body-regular',
  color = 'var(--black)',
  preserveWhitespace = false,
}: DetailRowProps) => (
  <Box
    className={`detail-row ${className}`}
    role={label ? 'group' : undefined}
    aria-label={label}
    sx={{
      display: 'grid',
      gridTemplateColumns: icon
        ? 'var(--icon-size-small) minmax(0, 1fr)'
        : 'minmax(0, 1fr)',
      alignItems: 'start',
      gap: '8px',
      minWidth: 0,
      minHeight: 'max(1lh, var(--icon-size-small))',
    }}
  >
    {icon && (
      <Box
        aria-hidden
        sx={{
          display: 'flex',
          paddingBlockStart:
            'max(0px, calc((1lh - var(--icon-size-small)) / 2))',
          color: 'var(--grey-400)',
          '& > svg': {
            width: 'var(--icon-size-small)',
            height: 'var(--icon-size-small)',
          },
        }}
      >
        {icon}
      </Box>
    )}
    <Typography
      component="div"
      className={className}
      color={color}
      sx={{
        minWidth: 0,
        paddingBlockStart: 'max(0px, calc((var(--icon-size-small) - 1lh) / 2))',
        overflowWrap: 'anywhere',
        whiteSpace: preserveWhitespace ? 'pre-wrap' : 'normal',
      }}
    >
      {children}
    </Typography>
  </Box>
);

export default DetailRow;
