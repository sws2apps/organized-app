import PropTypes from 'prop-types';
import { Box, IconButton } from '@mui/material';
import { IconArrowBack } from '@icons';
import { Typography } from '@components';

const PageHeader = ({ title, description, onClick }) => {
  return (
    <Box sx={{ marginBottom: '32px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { mobile: '8px', laptop: '16px' }, marginBottom: '16px' }}>
        <IconButton sx={{ margin: 0, padding: 0 }} onClick={onClick}>
          <IconArrowBack color="var(--black)" />
        </IconButton>
        <Typography variant="h1" color="var(--black)">
          {title}
        </Typography>
      </Box>
      {description && (
        <Typography variant="body-regular" color="var(--grey-400)">
          {description}
        </Typography>
      )}
    </Box>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  onClick: PropTypes.func,
};

export default PageHeader;
