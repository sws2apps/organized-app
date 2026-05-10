import { Box, Button } from '@mui/material';
import IconLoading from '@components/icon_loading';
import { OAuthButtonBaseProps } from './index.types';
import useButtonBase from './useButtonBase';
import Typography from '@components/typography';

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
        justifyContent: 'center',
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
        '&:focus-visible': {
          outline: 'var(--accent-main) auto 1px',
        },
        '&:active': {
          background: 'var(--accent-200)',
        },
      }}
      onClick={handleOAuthAction}
    >
      <Box sx={{ width: '22px' }} />
      {logo}
      <Typography className="h4" color="var(--black)">
        {text}
      </Typography>
      <Box
        sx={{
          width: '22px',
          height: '22px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isAuthProcessing && currentProvider === provider?.providerId && (
          <IconLoading width={22} height={22} color="var(--black)" />
        )}
      </Box>
    </Button>
  );
};

export default OAuthButtonBase;
