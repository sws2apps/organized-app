import { Box, Button } from '@mui/material';
import { OAuthButtonBaseProps } from './index.types';
import useButtonBase from './useButtonBase';
import Typography from '@components/typography';
import WaitingLoader from '@components/waiting_loader';

const OAuthButtonBase = (props: OAuthButtonBaseProps) => {
  const { logo, text, provider } = props;

  const { isAuthProcessing, currentProvider, handleOAuthAction } =
    useButtonBase(props);

  return (
    <Button
      disableRipple
      fullWidth
      sx={{
        display: 'flex',
        minHeight: '44px',
        padding: '12px',
        alignItems: 'center',
        gap: '8px',
        border: '1px solid var(--accent-350)',
        borderRadius: 'var(--radius-l)',
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
      }}
      onClick={handleOAuthAction}
    >
      {logo}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography className="h4" color="var(--black)">
          {text}
        </Typography>
        {isAuthProcessing && currentProvider === provider?.providerId && (
          <WaitingLoader size={17} color="var(--black)" variant="standard" />
        )}
      </Box>
    </Button>
  );
};

export default OAuthButtonBase;
