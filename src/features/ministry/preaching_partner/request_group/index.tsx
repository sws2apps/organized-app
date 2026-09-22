import { Box } from '@mui/material';
import { Children, Fragment } from 'react';
import { PreachingPartnerGroupProps } from './index.types';
import { formatLongDateWithShortVars } from '@utils/date';
import { useBreakpoints } from '@hooks/index';
import Divider from '@components/divider';
import Typography from '@components/typography';

const PreachingPartnerGroup = ({
  date,
  children,
}: PreachingPartnerGroupProps) => {
  const { tablet688Up } = useBreakpoints();

  const rows = Children.toArray(children);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: tablet688Up ? '12px' : '8px',
      }}
    >
      <Typography className="h4">
        {formatLongDateWithShortVars(date)}
      </Typography>

      {/* rows of one day sit close, so the day reads as a single block */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {rows.map((row, index) => (
          <Fragment key={index}>
            {index > 0 && <Divider color="var(--accent-200)" />}
            {row}
          </Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default PreachingPartnerGroup;
