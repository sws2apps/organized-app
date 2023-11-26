import PropTypes from 'prop-types';
import { Typography } from '@components';
import { Box, List } from '@mui/material';

const DashboardCard = ({ header, children }) => {
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
        },
        '& li:last-child': {
          borderBottom: 'none',
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
        <Typography variant="h2" color="var(--accent-dark)" sx={{ textAlign: 'center' }}>
          {header}
        </Typography>
      </Box>
      <Box sx={{ marginTop: '8px', width: '100%' }}>
        <List sx={{ paddingTop: 0, paddingBottom: 0 }}>{children}</List>
      </Box>
    </Box>
  );
};

DashboardCard.propTypes = {
  header: PropTypes.string,
  children: PropTypes.node,
};

export default DashboardCard;
