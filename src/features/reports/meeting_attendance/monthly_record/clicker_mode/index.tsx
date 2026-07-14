import {
  forwardRef,
  type PointerEvent as ReactPointerEvent,
  ReactElement,
  Ref,
  useMemo,
  useRef,
} from 'react';
import { Box, Dialog, Slide, Stack } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { IconConference, IconRefresh, IconVisitors } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { ClickerModeProps, ClickerTab } from './index.types';
import useClickerMode from './useClickerMode';
import { ClickerBody, ClickerLayout } from './index.styles';
import Button from '@components/button';
import SubpageHeader from '@components/subpage_header';
import TabSwitcher from '@components/tab_switcher';
import CountSwap from './count_swap';
import CounterPad from './counter_pad';

// Minimum horizontal travel (px) for a drag to count as a tab-switch swipe,
// rather than a tap or a scroll.
const SWIPE_THRESHOLD = 48;

/**
 * Slide-up transition for the full-screen overlay.
 */
const SlideUp = forwardRef(function SlideUp(
  props: TransitionProps & { children: ReactElement },
  ref: Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**
 * Full-screen "Clicker mode" overlay for tallying attendance with large
 * plus / minus controls instead of the keyboard. The user can switch between
 * the present and online counts, reset, then save the tallied value(s) back
 * into the attendance record.
 */
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

  // Single source of truth for the tabs — drives both the switcher and the
  // swipe order, so adding a tab needs no second edit.
  const tabOptions = useMemo(
    () => [
      { value: 'present' as ClickerTab, label: t('tr_present'), icon: <IconVisitors /> },
      { value: 'online' as ClickerTab, label: t('tr_online'), icon: <IconConference /> },
    ],
    [t]
  );

  // Horizontal drag over the counter switches tabs — works with touch, pen, or
  // a mouse (the clicker also shows on narrow desktop windows), matching the
  // crossfade direction (drag left → next tab, right → previous). Vertical or
  // short movements are ignored so scrolling and plain clicks still work.
  const swipeStart = useRef<{ x: number; y: number } | null>(null);

  const handleSwipeStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return; // primary contact / left button only
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
      slots={{ transition: SlideUp }}
      slotProps={{
        paper: { style: { backgroundColor: 'var(--accent-100)' } },
      }}
    >
      <ClickerLayout>
        {/* No secondaryTitle: it falls back to the parent page's title
            ("Meeting attendance record") automatically. */}
        <SubpageHeader title={title} onBack={onClose} backLabel={t('tr_back')} />

        <ClickerBody>
          {recordOnline && (
            <TabSwitcher<ClickerTab>
              value={tab}
              onChange={setTab}
              ariaLabel={t('tr_clickerMode')}
              options={tabOptions}
            />
          )}

          {/* The swipe target fills the whole area above the pad — the count
              and the reset row — so a tab-switch swipe can land anywhere in that
              open space, not just on the number. The controls below stay out of
              it so a press never reads as a swipe. */}
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
              // Let the browser handle vertical panning; we own horizontal swipes.
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

            {/* Reset has nothing to undo at zero, so it fades out and is
                disabled there, fading back in once the count moves. It keeps its
                slot (opacity, not display) so the pad below never jumps. */}
            <Box
              aria-hidden={!resetActive}
              sx={{
                opacity: resetActive ? 1 : 0,
                pointerEvents: resetActive ? 'auto' : 'none',
                transition: 'opacity 0.25s ease',
              }}
            >
              <Button
                variant="secondary"
                onClick={handleReset}
                disabled={!resetActive}
                disableAutoStretch
                startIcon={
                  <Box
                    component="span"
                    sx={{
                      display: 'inline-flex',
                      transform: `rotate(${resetSpin * 360}deg)`,
                      transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    <IconRefresh />
                  </Box>
                }
                sx={{
                  color: 'var(--accent-main)',
                  '& svg, & svg g, & svg g path': { fill: 'var(--accent-main)' },
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
