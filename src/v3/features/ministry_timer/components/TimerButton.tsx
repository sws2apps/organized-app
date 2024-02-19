import { ReactElement } from 'react';
import { Button } from '@mui/material';
import { Typography } from '@components';

const TimerButton = ({
  text = '',
  icon = null,
  onClick,
}: {
  text: string;
  icon: ReactElement;
  onClick?: VoidFunction;
}) => {
  return (
    <Button
      disableRipple
      sx={{
        textTransform: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        flex: '1 0 0',
        borderRadius: 'var(--radius-l)',
        background: 'var(--accent-150)',
        padding: '12px 8px',
        '&:hover': {
          background: 'var(--accent-200)',
          '@media (hover: none)': {
            background: 'var(--accent-150)',
          },
        },
        '&:active': {
          background: 'var(--accent-300)',
        },
      }}
      onClick={onClick}
    >
      {icon}
      <Typography className="h4" color="var(--accent-dark)">
        {text}
      </Typography>
    </Button>
  );
};

export default TimerButton;
