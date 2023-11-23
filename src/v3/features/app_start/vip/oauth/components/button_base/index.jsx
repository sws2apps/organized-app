import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import { Typography } from '@components';
import useButtonBase from './useButtonBase';
import { IconLoading } from '@icons';

const OAuthButtonBase = ({ logo, text, provider, isEmail }) => {
  const { handleAction, isAuthProcessing, currentProvider } = useButtonBase({ provider, isEmail });

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
        '&:active': {
          background: 'var(--accent-200)',
        },
        '& svg': {
          padding: '0px 8px',
          boxSizing: 'content-box',
        },
      }}
      onClick={handleAction}
    >
      {logo}
      <Box sx={{ display: 'flex', flex: '1 0 0', padding: '4px 8px', alignItems: 'center' }}>
        <Typography variant="h4" color="var(--black)">
          {text}
        </Typography>
        {isAuthProcessing && currentProvider === provider?.providerId && (
          <IconLoading width={22} height={22} color="var(--black)" />
        )}
      </Box>
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
