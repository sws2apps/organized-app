import {
  forwardRef,
  type PointerEvent as ReactPointerEvent,
  ReactElement,
  Ref,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Box, Dialog, Slide, Stack } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { IconConference, IconRefresh, IconVisitors } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { ClickerModeProps, ClickerTab } from './index.types';
import useClickerMode from './useClickerMode';
import { ClickerBody, ClickerLayout } from './index.styles';
import Button from '@components/button';
import SubpageNavbar from '@components/subpage_navbar';
import TabSwitcher from '@components/tab_switcher';
import CountSwap from './count_swap';
import CounterPad from './counter_pad';

const SWIPE_THRESHOLD = 48;

const SlideUp = forwardRef(function SlideUp(
  props: TransitionProps & { children: ReactElement },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ClickerMode = (props: ClickerModeProps) => {
  const { t } = useAppTranslation();

  const {
    open,
    onClose,
    title,
    initialTab,
    recordOnline,
    presentValue,
    onlineValue,
  } = props;

  const {
    tab,
    setTab,
    count,
    resetSpin,
    resetting,
    shakeSignal,
    handleIncrement,
    handleDecrement,
    handleReset,
    handleSave,
  } = useClickerMode({
    open,
    onClose,
    initialTab,
    presentValue,
    onlineValue,
    onSave: props.onSave,
  });

  const resetActive = count > 0;
  const resetVisible = resetActive || resetting;

  // Mirror the reset button's :active look via a class, so the first press
  // right after a tab switch is styled as clicked (the browser skips :active
  // for that press because focus has just moved).
  const [resetPressed, setResetPressed] = useState(false);

  const tabOptions = useMemo(
    () => [
      { value: 'present' as ClickerTab, label: t('tr_present'), icon: <IconVisitors /> },
      { value: 'online' as ClickerTab, label: t('tr_online'), icon: <IconConference /> },
    ],
    [t]
  );

  const swipeStart = useRef<{ x: number; y: number } | null>(null);

  const handleSwipeStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    swipeStart.current = { x: event.clientX, y: event.clientY };
  };

  const handleSwipeEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const start = swipeStart.current;
    swipeStart.current = null;

    if (!recordOnline || !start) return;

    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) <= Math.abs(dy)) return;

    const order = tabOptions.map((option) => option.value);
    const next = order[order.indexOf(tab) + (dx < 0 ? 1 : -1)];
    if (next) setTab(next);
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      aria-label={title}
      slots={{ transition: SlideUp }}
      slotProps={{
        paper: { style: { backgroundColor: 'var(--accent-100)' } },
      }}
    >
      <ClickerLayout>
        <SubpageNavbar title={title} onBack={onClose} backLabel={t('tr_back')} />

        <ClickerBody>
          {recordOnline && (
            <TabSwitcher<ClickerTab>
              value={tab}
              onChange={setTab}
              ariaLabel={t('tr_clickerMode')}
              options={tabOptions}
            />
          )}

          <Box
            onPointerDown={handleSwipeStart}
            onPointerUp={handleSwipeEnd}
            sx={{
              flex: 1,
              minHeight: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              overflow: 'hidden',
              touchAction: 'pan-y',
            }}
          >
            <Box
              sx={{
                flex: 1,
                minHeight: 0,
                alignSelf: 'stretch',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CountSwap
                tab={tab}
                value={count}
                label={t('tr_count')}
                shake={shakeSignal}
              />
            </Box>

            <Box
              aria-hidden={!resetVisible}
              onPointerDown={(event) => {
                if (event.button === 0) setResetPressed(true);
              }}
              onPointerUp={() => setResetPressed(false)}
              onPointerLeave={() => setResetPressed(false)}
              onPointerCancel={() => setResetPressed(false)}
              sx={{
                opacity: resetVisible ? 1 : 0,
                pointerEvents: resetVisible ? 'auto' : 'none',
                transition: 'opacity 0.25s ease',
              }}
            >
              <Button
                variant="secondary"
                pressed={resetPressed}
                onClick={handleReset}
                disabled={!resetVisible}
                disableAutoStretch
                startIcon={
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-flex',
                      // scaleX flips the arrow and its spin counter-clockwise.
                      transform: `scaleX(-1) rotate(${resetSpin * 360}deg)`,
                      transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <IconRefresh />
                  </Box>
                }
                sx={{
                  color: 'var(--accent-main)',
                  '& svg, & svg g, & svg g path': { fill: 'var(--accent-main)' },
                  '&.is-pressed': { backgroundColor: 'var(--accent-150)' },
                }}
              >
                {t('tr_reset')}
              </Button>
            </Box>
          </Box>

          <Stack spacing="24px">
            <CounterPad
              onIncrement={handleIncrement}
              onDecrement={handleDecrement}
              decrementDisabled={count === 0}
            />

            <Stack spacing="8px">
              <Button variant="main" onClick={handleSave}>
                {t('tr_save')}
              </Button>
              <Button variant="secondary" onClick={onClose}>
                {t('tr_cancel')}
              </Button>
            </Stack>
          </Stack>
        </ClickerBody>
      </ClickerLayout>
    </Dialog>
  );
};

export default ClickerMode;
