import { ReactNode } from 'react';
import { Box, List } from '@mui/material';
import Typography from '@components/typography';

const DashboardCard = ({ header, children }: { header: string; children?: ReactNode }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        height: { mobile: 'auto', tablet688: '336px' },
        minWidth: '300px',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--accent-200)',
        background: 'var(--white)',
        padding: '8px',
        '& li': {
          borderBottom: '1px solid var(--accent-200)',
          padding: '4px 0px',
        },
        '& li:last-child': {
          borderBottom: 'none',
          padding: '4px 0px 0px 0px',
        },
      }}
      className="big-card-shadow"
    >
      <Box
        sx={{
          padding: '16px 0',
          alignSelf: 'stretch',
          borderRadius: 'var(--radius-m)',
          background: 'var(--accent-200)',
        }}
      >
        <Typography className="h2" color="var(--accent-dark)" sx={{ textAlign: 'center' }}>
          {header}
        </Typography>
      </Box>
      <Box sx={{ marginTop: '8px', width: '100%', overflow: 'auto' }}>
        <List sx={{ paddingTop: 0, paddingBottom: 0 }}>{children}</List>
      </Box>
    </Box>
  );
};

export default DashboardCard;
