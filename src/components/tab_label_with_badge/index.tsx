import { Box } from '@mui/material';

const LabelBadge = ({ value }: { value: number }) => (
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
      opacity: value === 0 ? 0 : 1,
      transition: 'opacity 0.2s',
    }}
  >
    {value.toString()}
  </Box>
);

const TabLabelWithBadge = ({
  label,
  count,
}: {
  label: string;
  count: number;
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transform: count === 0 && 'translateX(12px)',
        transition: 'transform 0.2s',
      }}
    >
      {label}
      <LabelBadge value={count} />
    </Box>
  );
};

export default TabLabelWithBadge;
