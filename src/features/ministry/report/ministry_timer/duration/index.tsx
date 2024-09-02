import { keyframes } from '@emotion/react';
import { DurationProps } from './index.types';
import Typography from '@components/typography';

const blink = keyframes`
   0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

const Duration = ({ value, paused, onClick }: DurationProps) => {
  return (
    <Typography
      onClick={onClick}
      className="h3"
      color={value === '00:00' ? 'var(--accent-300)' : 'var(--accent-dark)'}
      sx={{
        textAlign: 'center',
        width: '64px',
        '&:hover': {
          color: value === '00:00' ? 'var(--accent-350)' : 'var(--accent-main)',
          '@media (hover: none)': {
            color:
              value === '00:00' ? 'var(--accent-300)' : 'var(--accent-dark)',
          },
        },
        '&:active': {
          color:
            value === '00:00' ? 'var(--accent-400)' : 'var(--accent-click)',
        },
        cursor: 'pointer',
        userSelect: 'none',
        animation: paused && `${blink} 1s steps(1, end) infinite`,
      }}
    >
      {value}
    </Typography>
  );
};

export default Duration;
