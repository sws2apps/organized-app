import { useId } from 'react';
import { Box } from '@mui/material';
import DetailRow from '@components/detail_row';
import Typography from '@components/typography';
import { LabeledDetailProps } from '@components/labeled_detail/index.types';

/** A visible label above flexible read-only content, with an optional icon. */
const LabeledDetail = ({
  label,
  children,
  icon,
  valueClassName = 'body-small-regular',
}: LabeledDetailProps) => {
  const labelId = useId();

  return (
    <Box
      role="group"
      aria-labelledby={labelId}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--detail-label-gap)',
        minWidth: 0,
      }}
    >
      <Typography
        id={labelId}
        component="div"
        className="label-small-regular"
        color="var(--text-muted)"
        sx={{ overflowWrap: 'anywhere' }}
      >
        {label}
      </Typography>
      <DetailRow icon={icon} className={valueClassName}>
        {children}
      </DetailRow>
    </Box>
  );
};

export default LabeledDetail;
