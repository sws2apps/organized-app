import { ReactElement } from 'react';
import { AuthProvider } from 'firebase/auth';
import { Box, Button } from '@mui/material';
import { IconLoading } from '@icons/index';
import Typography from '@components/typography';
import useButtonBase from './useButtonBase';

const OAuthButtonBase = ({
  logo,
  text,
  provider,
  isEmail,
}: {
  logo: ReactElement;
  text: string;
  provider?: AuthProvider;
  isEmail?: boolean;
}) => {
  const { handleAction, isAuthProcessing, currentProvider } = useButtonBase({ provider, isEmail });

  return (
    <Button
      disableRipple
      sx={{
        display: 'flex',
        minHeight: '44px',
        padding: '4px var(--radius-none) 4px 8px',
        alignItems: 'center',
        gap: 'var(--radius-none)',
        border: '1px solid var(--accent-350)',
        borderRadius: 'var(--radius-l)',
        width: '100%',
        textAlign: 'left',
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
        <Typography className="h4" color="var(--black)">
          {text}
        </Typography>
        {isAuthProcessing && currentProvider === provider?.providerId && (
          <IconLoading width={22} height={22} color="var(--black)" />
        )}
      </Box>
    </Button>
  );
};

export default OAuthButtonBase;
