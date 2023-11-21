import PropTypes from 'prop-types';
// import useButtonBase from './useButtonBase';
import { Box } from '@mui/material';
import { Typography } from '@components';

// { logo, text, provider, isEmail }
const OAuthButtonBase = ({ logo, text }) => {
  // const { handleAction, isAuthProcessing, visitorID } = useButtonBase({ provider, isEmail });

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '44px',
        padding: '4px var(--radius-none) 4px 8px',
        alignItems: 'center',
        gap: 'var(--radius-none)',
        border: '1px solid var(--accent-350)',
        borderRadius: 'var(--radius-l)',
        width: '100%',
        cursor: 'pointer',
        userSelect: 'none',
        '&:hover': {
          border: '1px solid var(--accent-main)',
          background: 'var(--accent-100)',
          '@media (hover: none)': {
            border: '1px solid var(--accent-350)',
            background: 'unset',
          },
        },
        '& svg': {
          padding: '0px 8px',
          boxSizing: 'content-box',
        },
      }}
    >
      {logo}
      <Typography variant="h4" color="var(--black)" sx={{ padding: '4px 8px', flex: '1 0 0' }}>
        {text}
      </Typography>
    </Box>
  );
};

OAuthButtonBase.propTypes = {
  buttonStyles: PropTypes.object,
  logo: PropTypes.element,
  text: PropTypes.string,
  provider: PropTypes.object,
  isEmail: PropTypes.bool,
};

export default OAuthButtonBase;
