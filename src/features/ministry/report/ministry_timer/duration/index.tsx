import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';
import { DurationProps } from './index.types';
import useDuration from './useDuration';
import Typography from '@components/typography';
import RollingDigit from './rolling_digit';

const blink = keyframes`
   0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

/**
 * Digits keyed by their place from the right, so the ones digit keeps its
 * slot when the group changes length (59 minutes → 1 hour).
 */
const renderDigits = (value: string, animate: boolean) =>
  value
    .split('')
    .map((char, index, all) => (
      <RollingDigit
        key={`place-${all.length - index}`}
        char={char}
        animate={animate}
      />
    ));

const Duration = (props: DurationProps) => {
  const { first, isHour, second, defaultColor, hoverColor, activeColor } =
    useDuration(props);

  // digits only roll while the clock is running; pausing, stopping and
  // adding time by hand change them in place
  const animate = Boolean(props.started);

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
        fontVariantNumeric: 'tabular-nums',
        animation: props.paused && `${blink} 1s steps(1, end) infinite`,
      }}
    >
      <Typography
        onClick={props.onClick}
        className="h3"
        sx={{ width: '29px', textAlign: 'right' }}
      >
        {renderDigits(first, animate)}
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
        {renderDigits(second, animate)}
      </Typography>
    </Box>
  );
};

export default Duration;
