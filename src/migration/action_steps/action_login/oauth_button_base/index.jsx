/* eslint-disable react/prop-types */

import { Box, Button, CircularProgress, Typography } from '@mui/material';
import useOAuthButtonBase from './useOAuthButtonBase';

const OAuthButtonBase = (props) => {
  const { handleAction, isAuthProcessing, currentProvider } =
    useOAuthButtonBase(props);

  return (
    <Button
      variant="contained"
      sx={{
        ...props.buttonStyles,
        height: '41px',
        padding: 0,
        width: '100%',
        maxWidth: '320px',
        justifyContent: 'flex-start',
      }}
      onClick={handleAction}
    >
      <Box sx={{ width: '50px', display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            backgroundColor: 'white',
            padding: '10px',
            marginLeft: '1px',
            borderTopLeftRadius: '4px',
            borderBottomLeftRadius: '4px',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <img
            alt="Icon"
            src={props.logo}
            style={{ width: '18px', height: '18px' }}
          />
        </Box>
      </Box>
      <Typography variant="body2" sx={{ textTransform: 'none' }}>
        {props.text}
      </Typography>

      {isAuthProcessing && currentProvider === props.provider?.providerId && (
        <CircularProgress
          size={16}
          color="inherit"
          sx={{ marginLeft: '8px' }}
        />
      )}
    </Button>
  );
};

export default OAuthButtonBase;
