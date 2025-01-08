import { ReactElement } from 'react';
import { AuthProvider } from 'firebase/auth';
import { Button } from '@mui/material';
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
  const { handleAction, isAuthProcessing, currentProvider } = useButtonBase({
    provider,
    isEmail,
  });

  return (
    <Button
      disableRipple
      sx={{
        display: 'flex',
        minHeight: '44px',
        justifyContent: 'center',
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
          marginRight: '8px',
          boxSizing: 'content-box',
        },
      }}
      onClick={handleAction}
    >
      {logo}
      <Typography className="h4" color="var(--black)">
        {text}
      </Typography>
      {isAuthProcessing && currentProvider === provider?.providerId && (
        <IconLoading width={22} height={22} color="var(--black)" />
      )}
    </Button>
  );
};

export default OAuthButtonBase;
