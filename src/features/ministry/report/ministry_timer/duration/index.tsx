import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';
import { DurationProps } from './index.types';
import useDuration from './useDuration';
import Typography from '@components/typography';

const blink = keyframes`
   0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

const Duration = (props: DurationProps) => {
  const { first, isHour, second, defaultColor, hoverColor, activeColor } =
    useDuration(props);

  return (
    <Box
      onClick={props.onClick}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '64px',
        '& p': {
          color: defaultColor,
        },
        '&:hover': {
          '& p': {
            color: hoverColor,
            '@media (hover: none)': {
              color: defaultColor,
            },
          },
        },
        '&:active': {
          '& p': {
            color: activeColor,
          },
        },
        cursor: 'pointer',
        userSelect: 'none',
        animation: props.paused && `${blink} 1s steps(1, end) infinite`,
      }}
    >
      <Typography
        onClick={props.onClick}
        className="h3"
        sx={{ width: '29px', textAlign: 'right' }}
      >
        {first}
      </Typography>
      <Typography
        onClick={props.onClick}
        className="h3"
        sx={{
          width: '6px',
          textAlign: 'center',
          animation:
            props.started && isHour && `${blink} 1s steps(1, end) infinite`,
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
