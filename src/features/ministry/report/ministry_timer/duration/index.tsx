import { Box } from '@mui/material';
import styled, { css, keyframes } from 'styled-components';
import { DurationProps } from './index.types';
import useDuration from './useDuration';
import Typography from '@components/typography';

const blink = keyframes`
   0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
`;

const DurationBox = styled(Box)<{
  $blink?: boolean;
  $defaultColor?: string;
  $hoverColor?: string;
  $activeColor?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  cursor: pointer;
  user-select: none;
  ${({ $blink }) => $blink && css`animation: ${blink} 1s steps(1, end) infinite;`}

  & p {
    color: ${({ $defaultColor }) => $defaultColor};
  }

  &:hover {
    & p {
      color: ${({ $hoverColor }) => $hoverColor};
    }

    @media (hover: none) {
      & p {
        color: ${({ $defaultColor }) => $defaultColor};
      }
    }
  }

  &:active {
    & p {
      color: ${({ $activeColor }) => $activeColor};
    }
  }
`;

const Colon = styled(Typography)<{ $blink?: boolean }>`
  width: 6px;
  text-align: center;
  ${({ $blink }) => $blink && css`animation: ${blink} 1s steps(1, end) infinite;`}
`;

const Duration = (props: DurationProps) => {
  const { first, isHour, second, defaultColor, hoverColor, activeColor } =
    useDuration(props);

  return (
    <DurationBox
      onClick={props.onClick}
      $blink={props.paused}
      $defaultColor={defaultColor}
      $hoverColor={hoverColor}
      $activeColor={activeColor}
    >
      <Typography
        onClick={props.onClick}
        className="h3"
        sx={{ width: '29px', textAlign: 'right' }}
      >
        {first}
      </Typography>
      <Colon className="h3" $blink={props.started && isHour}>
        :
      </Colon>
      <Typography className="h3" sx={{ width: '29px', textAlign: 'left' }}>
        {second}
      </Typography>
    </DurationBox>
  );
};

export default Duration;
