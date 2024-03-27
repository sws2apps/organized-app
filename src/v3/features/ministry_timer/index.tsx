import { Box } from '@mui/material';
import { IconAddTime, IconPause, IconResume, IconStart, IconStop } from '@icons/index';
import Typography from '@components/typography';
import TimerButton from './components/TimerButton';
import { useAppTranslation } from '@hooks/index';
import { useEffect, useState } from 'react';
import { MinistryTimerButtonProps, MinistryTimerStates } from './ministry_timer.types';

/**
 * Left Ministry Timer Button component.
 * Renders a timer button based on the state of the ministry timer.
 * @param {MinistryTimerButtonProps} props - The props for the component.
 * @returns {JSX.Element} The JSX representation of the component.
 */
const LeftMinistryTimerButton = (props: MinistryTimerButtonProps) => {
  const { t } = useAppTranslation();

  switch (props.state) {
    case MinistryTimerStates.Zero:
      return (
        <TimerButton
          text={t('tr_timerLabelTime')}
          icon={<IconAddTime color="var(--accent-dark)" />}
          onClick={props.onClick}
        />
      );

    case MinistryTimerStates.Started:
    case MinistryTimerStates.Paused:
      return (
        <TimerButton
          text={t('tr_timerLabelStop')}
          icon={<IconStop color="var(--accent-dark)" />}
          onClick={props.onClick}
        />
      );
  }
};

/**
 * Right Ministry Timer Button component.
 * Renders a timer button based on the state of the ministry timer.
 * @param {MinistryTimerButtonProps} props - The props for the component.
 * @returns {JSX.Element} The JSX representation of the component.
 */
const RightMinistryTimerButton = (props: MinistryTimerButtonProps) => {
  const { t } = useAppTranslation();

  switch (props.state) {
    case MinistryTimerStates.Zero:
      return (
        <TimerButton
          text={t('tr_timerLabelStart')}
          icon={<IconStart color="var(--accent-dark)" />}
          onClick={props.onClick}
        />
      );

    case MinistryTimerStates.Started:
      return (
        <TimerButton
          text={t('tr_timerLabelPause')}
          icon={<IconPause color="var(--accent-dark)" />}
          onClick={props.onClick}
        />
      );

    case MinistryTimerStates.Paused:
      return (
        <TimerButton
          text={t('tr_timerLabelResume')}
          icon={<IconResume color="var(--accent-dark)" />}
          onClick={props.onClick}
        />
      );
  }
};

/**
 * Ministry Timer component.
 * Displays a timer with start, pause, resume, and stop buttons.
 * @param {Object} props - The props for the component.
 * @param {string} [props.duration='0:00'] - The initial duration for the timer in 'HH:MM' format.
 * @returns {JSX.Element} The JSX representation of the component.
 */
const MinistryTimer = ({ duration = '0:00' }: { duration?: string }) => {
  const [timerState, setTimerState] = useState(MinistryTimerStates.Zero);
  const [timerTextOpacity, setTimerTextOpacity] = useState(1);

  const changeButtonStates = () => {
    const numberOfStates = Object.keys(MinistryTimerStates).length / 2; // Divide by 2 because enums in TypeScript are bi-directional
    if (timerState !== numberOfStates - 1) {
      setTimerState(timerState + 1);
    } else {
      setTimerState(MinistryTimerStates.Started);
    }
  };

  /**
   * Converts a duration string in the format 'HH:MM' to seconds.
   * @param {string} duration - The duration string to convert.
   * @returns {number} The duration in seconds.
   */
  const convertDurationStringToSeconds = (duration: string): number => {
    const [hours, minutes] = duration.split(':');
    return parseInt(hours) * 3600 + parseInt(minutes) * 60;
  };

  /**
   * Converts a duration in seconds to a string format 'HH:MM'.
   * @param {number} seconds - The duration in seconds to convert.
   * @returns {string} The duration string in 'HH:MM' format.
   */
  const convertDurationInSecondsToString = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours === 0 && minutes === 0) {
      return '0:00';
    }

    const formattedHours = hours.toString();
    const formattedMinutes = minutes < 10 ? '0' + minutes.toString() : minutes.toString();

    return `${formattedHours}:${formattedMinutes}`;
  };

  const [durationInSeconds, setDurationInSeconds] = useState(() => {
    return convertDurationStringToSeconds(duration);
  });

  // For timer ticks
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    if (timerState !== MinistryTimerStates.Zero && timerState !== MinistryTimerStates.Paused) {
      intervalId = setInterval(() => {
        setDurationInSeconds((value) => {
          return value + 1;
        });
        console.log('bim bim ');
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timerState]);

  // For timer text opacity
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (timerState === MinistryTimerStates.Paused) {
      intervalId = setInterval(() => {
        setTimerTextOpacity((value) => {
          return value == 0 ? 1 : 0;
        });
      }, 1000);
    }

    if (timerState === MinistryTimerStates.Started) {
      setTimerTextOpacity(1);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [timerState]);

  const timerDuration = convertDurationInSecondsToString(durationInSeconds);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        padding: '4px 8px 12px 8px',
        gap: '12px',
      }}
    >
      <LeftMinistryTimerButton
        state={timerState}
        onClick={() => {
          console.log('hello');
        }}
      />
      <Typography
        variant="h2"
        color={timerDuration === '0:00' ? 'var(--accent-300)' : 'var(--accent-dark)'}
        sx={{
          textAlign: 'center',
          width: '64px',
          opacity: timerTextOpacity,
          '&:hover': {
            color: timerDuration === '0:00' ? 'var(--accent-350)' : 'var(--accent-main)',
            '@media (hover: none)': {
              color: timerDuration === '0:00' ? 'var(--accent-300)' : 'var(--accent-dark)',
            },
          },
          '&:active': {
            color: timerDuration === '0:00' ? 'var(--accent-400)' : 'var(--accent-click)',
          },
          cursor: 'pointer',
          userSelect: 'none',
        }}
      >
        {timerDuration}
      </Typography>
      <RightMinistryTimerButton
        state={timerState}
        onClick={() => {
          changeButtonStates();
          console.log('aaa');
        }}
      />
    </Box>
  );
};

export default MinistryTimer;
