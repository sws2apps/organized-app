import { Box } from '@mui/material';
import { CustomClassName } from '@definition/app';
import Typography from '@components/typography';

const LabelBadge = ({
  value,
  badgeColor = 'inherit',
}: {
  value: number;
  badgeColor?: string;
}) => (
  <Box
    sx={{
      backgroundColor: 'var(--accent-150)',
      borderRadius: 'var(--radius-s)',
      width: '24px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '24px',
      fontSize: '14px',
      opacity: 1,
      transition: 'opacity 0.2s',
    }}
  >
    <Typography className="body-small-semibold" sx={{ color: badgeColor }}>
      {value.toString()}
    </Typography>
  </Box>
);

const TabLabelWithBadge = ({
  label,
  count,
  className = 'body-regular',
  badgeColor,
  color,
}: {
  label: string;
  count: number;
  className?: CustomClassName;
  badgeColor?: string;
  color?: string;
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transform: count === 0 && 'translateX(12px)',
        transition: 'transform 0.2s',
        userSelect: 'none',
      }}
    >
      <Typography
        className={className}
        sx={{
          color: color ?? 'unset',
          fontWeight: '500 !important',
        }}
      >
        {label}
      </Typography>
      <LabelBadge value={count} badgeColor={badgeColor} />
    </Box>
  );
};

export default TabLabelWithBadge;
