import { Box } from '@mui/material';
import { Children } from 'react';
import { IconDate } from '@components/icons';
import { PreachingPartnerGroupProps } from './index.types';
import { formatLongDateWithShortVars } from '@utils/date';
import Divider from '@components/divider';
import Typography from '@components/typography';

const PreachingPartnerGroup = ({
  date,
  children,
}: PreachingPartnerGroupProps) => {
  const rows = Children.toArray(children);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <IconDate color="var(--black)" />
        <Typography className="h3">
          {formatLongDateWithShortVars(date)}
        </Typography>
      </Box>

      {rows.map((row, index) => (
        <Box
          key={index}
          sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
          {index > 0 && <Divider color="var(--accent-200)" />}
          {row}
        </Box>
      ))}
    </Box>
  );
};

export default PreachingPartnerGroup;
