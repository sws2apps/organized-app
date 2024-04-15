import { Box } from '@mui/material';
import { IconAddTime, IconPause, IconResume, IconStart, IconStop } from '@icons/index';
import TimerButton from './components/TimerButton';
import { useAppTranslation } from '@hooks/index';
import { useEffect, useMemo, useRef, useState } from 'react';
import { MinistryTimerButtonProps, MinistryTimerStates } from './ministry_timer.types';
import DarkOverlay from '@components/dark_overlay';
import PopUpForEditOrCreateBibleStudy from '../pop_up_for_edit_or_create_bible_study';
import { EditAndAddBibleStudyContext } from '../EditAndAddBibleStudyContext';
import { AddServiceTimeModalWindow } from '../add_service_time_modal_window';
import CustomTypography from '@components/typography';
import { convertDurationInSecondsToString, convertDurationStringToSeconds } from '../utils';

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
 * @param {string} [props.duration='00:00'] - The initial duration for the timer in 'HH:MM' format.
 * @returns {JSX.Element} The JSX representation of the component.
 */
const MinistryTimer = ({ duration = '00:00' }: { duration?: string }) => {
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

  const [durationInSeconds, setDurationInSeconds] = useState(() => {
    return convertDurationStringToSeconds(duration);
  });

  const resetDurationToNull = () => {
    setTimerState(MinistryTimerStates.Zero);
    setDurationInSeconds(convertDurationStringToSeconds('00:00'));
  };

  // For timer ticks
  useEffect(() => {
    let lastTime = 0;
    let requestId: number;

    const tick = (timestamp: number) => {
      if (timerState === MinistryTimerStates.Zero || timerState === MinistryTimerStates.Paused) {
        lastTime = timestamp;
        return;
      }

      const deltaTime = timestamp - lastTime;
      if (deltaTime >= 1000) {
        setDurationInSeconds((prev) => prev + Math.floor(deltaTime / 1000));
        lastTime = timestamp;
      }

      requestId = requestAnimationFrame(tick);
    };

    if (timerState === MinistryTimerStates.Started) {
      lastTime = performance.now();
      requestId = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(requestId);
    };
  }, [timerState]);

  // For timer text opacity
  useEffect(() => {
    let lastTime = 0;
    let requestId: number;

    const blink = (timestamp: number) => {
      if (timerState !== MinistryTimerStates.Paused) {
        setTimerTextOpacity(1);
        return;
      }

      const deltaTime = timestamp - lastTime;
      if (deltaTime >= 1000) {
        setTimerTextOpacity((prev) => (prev === 0 ? 1 : 0));
        lastTime = timestamp;
      }

      requestId = requestAnimationFrame(blink);
    };

    if (timerState === MinistryTimerStates.Paused) {
      lastTime = performance.now();
      requestId = requestAnimationFrame(blink);
    } else {
      setTimerTextOpacity(1);
    }

    return () => {
      cancelAnimationFrame(requestId);
    };
  }, [timerState]);

  const timerDuration = convertDurationInSecondsToString(durationInSeconds);

  const [addServiceTimeModalWindowOpen, setAddServiceTimeModalWindowOpen] = useState(false);

  const addServiceTimeModalWindowRef = useRef(null);

  const [bibleStudiesList, setBibleStudiesList] = useState([] /** Connect to API */);

  const defaultEAABSValue = {
    popUpWindowOpen: false,
    variant: 'add',
    itemValue: '',
    itemIndex: 0,
  };

  const [editAndAddBibleStudyData, setEditAndAddBibleStudyData] = useState(() => {
    return defaultEAABSValue;
  });

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      editAndAddBibleStudyData,
      setEditAndAddBibleStudyData,
    }),
    [editAndAddBibleStudyData]
  );

  return (
    <EditAndAddBibleStudyContext.Provider value={contextValue}>
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
            setAddServiceTimeModalWindowOpen(true);
            setTimerState(MinistryTimerStates.Zero);
          }}
        />
        <CustomTypography
          className="h3"
          color={timerDuration === '00:00' ? 'var(--accent-300)' : 'var(--accent-dark)'}
          sx={{
            textAlign: 'center',
            width: '64px',
            opacity: timerTextOpacity,
            '&:hover': {
              color: timerDuration === '00:00' ? 'var(--accent-350)' : 'var(--accent-main)',
              '@media (hover: none)': {
                color: timerDuration === '00:00' ? 'var(--accent-300)' : 'var(--accent-dark)',
              },
            },
            '&:active': {
              color: timerDuration === '00:00' ? 'var(--accent-400)' : 'var(--accent-click)',
            },
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          {timerDuration}
        </CustomTypography>
        <RightMinistryTimerButton
          state={timerState}
          onClick={() => {
            changeButtonStates();
          }}
        />
        <DarkOverlay overlayIsOpened={addServiceTimeModalWindowOpen}>
          {/** Connect to API */}
          <AddServiceTimeModalWindow
            variant="pioneer"
            showCreditHours={true}
            duration={durationInSeconds}
            bibleStudiesList={bibleStudiesList}
            cancelButtonClick={() => {
              setAddServiceTimeModalWindowOpen(false);
              setEditAndAddBibleStudyData(defaultEAABSValue);
            }}
            addButtonClick={() => {
              resetDurationToNull();
              setAddServiceTimeModalWindowOpen(false);
            }}
            result={(result) => {
              // Connect API
              console.log(result);
            }}
            open={true}
            reference={addServiceTimeModalWindowRef}
          />
          <PopUpForEditOrCreateBibleStudy
            variant={editAndAddBibleStudyData.variant as 'add' | 'edit'}
            value={editAndAddBibleStudyData.itemValue}
            open={editAndAddBibleStudyData.popUpWindowOpen}
            width={addServiceTimeModalWindowRef.current?.offsetWidth + 'px'}
            cancelButtonClick={() => {
              if (editAndAddBibleStudyData.variant == 'edit') {
                setBibleStudiesList((prev) => {
                  const tmpArray = [...prev];
                  tmpArray.splice(editAndAddBibleStudyData.itemIndex, 1);
                  return tmpArray;
                });
              }
              setEditAndAddBibleStudyData(defaultEAABSValue);
            }}
            closeButtonClick={() => setEditAndAddBibleStudyData(defaultEAABSValue)}
            saveButtonClick={(value) => {
              setBibleStudiesList((prev) => {
                const tmpArray = [...prev];

                if (editAndAddBibleStudyData.variant == 'add') {
                  tmpArray.push(value);
                } else {
                  tmpArray[editAndAddBibleStudyData.itemIndex] = value;
                }

                return tmpArray;
              });

              setEditAndAddBibleStudyData(defaultEAABSValue);
            }}
          />
        </DarkOverlay>
      </Box>
    </EditAndAddBibleStudyContext.Provider>
  );
};

export default MinistryTimer;
