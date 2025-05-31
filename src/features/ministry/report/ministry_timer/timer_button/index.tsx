import { ReactElement } from 'react';
import { Button } from '@mui/material';
import useCurrentUser from '@hooks/useCurrentUser';
import Typography from '@components/typography';

const TimerButton = ({
  text = '',
  icon = null,
  onClick,
}: {
  text: string;
  icon: ReactElement;
  onClick?: VoidFunction;
}) => {
  const { isGroup } = useCurrentUser();

  return (
    <Button
      disableRipple
      sx={{
        textTransform: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2px',
        flex: '1 0 0',
        borderRadius: 'var(--radius-l)',
        background: isGroup ? 'var(--red-secondary)' : 'var(--accent-150)',
        padding: '12px 8px',
        '&:hover': {
          background: isGroup
            ? 'rgba(var(--red-main-base), 0.2)'
            : 'var(--accent-200)',
          '@media (hover: none)': {
            background: isGroup ? 'var(--red-secondary)' : 'var(--accent-150)',
          },
        },

        '&:focus-visible': {
          outline: `${isGroup ? 'var(--red-main)' : 'var(--accent-main)'} auto 1px`,
        },

        '&:active': {
          background: isGroup
            ? 'rgba(var(--red-main-base), 0.4)'
            : 'var(--accent-300)',
        },
      }}
      onClick={onClick}
    >
      {icon}
      <Typography
        className="h4"
        color={isGroup ? 'var(--red-dark)' : 'var(--accent-dark)'}
      >
        {text}
      </Typography>
    </Button>
  );
};

export default TimerButton;
