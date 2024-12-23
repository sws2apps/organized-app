import { useMemo } from 'react';
import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';
import { DurationProps } from './index.types';
import Typography from '@components/typography';

const blink = keyframes`
   0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

const Duration = ({ paused, onClick, time, started }: DurationProps) => {
  const { first, second, isHour } = useMemo(() => {
    const seconds = time % 60;

    const minutesTotal = (time - seconds) / 60;
    const minutes = minutesTotal % 60;

    const hoursTotal = time - seconds - minutes * 60;
    const hours = hoursTotal / 3600;

    if (hours === 0) {
      return {
        first: String(minutes).padStart(2, '0'),
        second: String(seconds).padStart(2, '0'),
      };
    }

    if (hours > 0) {
      return {
        first: hours,
        second: String(minutes).padStart(2, '0'),
        isHour: true,
      };
    }
  }, [time]);

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '64px',
        '& p': {
          color:
            first === '00' && second === '00'
              ? 'var(--accent-300)'
              : 'var(--accent-dark)',
        },
        '&:hover': {
          '& p': {
            color:
              first === '00' && second === '00'
                ? 'var(--accent-350)'
                : 'var(--accent-main)',
            '@media (hover: none)': {
              color:
                first === '00' && second === '00'
                  ? 'var(--accent-300)'
                  : 'var(--accent-dark)',
            },
          },
        },
        '&:active': {
          '& p': {
            color:
              first === '00' && second === '00'
                ? 'var(--accent-400)'
                : 'var(--accent-click)',
          },
        },
        cursor: 'pointer',
        userSelect: 'none',
        animation: paused && `${blink} 1s steps(1, end) infinite`,
      }}
    >
      <Typography
        onClick={onClick}
        className="h3"
        sx={{ width: '29px', textAlign: 'right' }}
      >
        {first}
      </Typography>
      <Typography
        onClick={onClick}
        className="h3"
        sx={{
          width: '6px',
          textAlign: 'center',
          animation: started && isHour && `${blink} 1s steps(1, end) infinite`,
        }}
      >
        :
      </Typography>
      <Typography className="h3" sx={{ width: '29px', textAlign: 'left' }}>
        {second}
      </Typography>
    </Box>
  );
};

export default Duration;
