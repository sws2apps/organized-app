import { useEffect, useRef, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { IconNavigateLeft, IconNavigateRight } from '@components/icons';
import { DateNavigatorDirection, DateNavigatorType } from './index.types';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import Badge from '@components/badge';
import ButtonIcon from '@components/icon_button';
import Typography from '@components/typography';
import PeriodBadge from '@components/date_navigator/period_badge';

const DURATION = 320;
const DISTANCE = 40;
const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
const BLEED = 48;
const FADE = 32;

const EDGE_FADE = [
  'linear-gradient(to right',
  'transparent 0',
  `transparent ${BLEED - FADE}px`,
  `#000 ${BLEED}px`,
  `#000 calc(100% - ${BLEED}px)`,
  `transparent calc(100% - ${BLEED - FADE}px)`,
  'transparent 100%)',
].join(', ');

const keyframes = {
  '@keyframes date-navigator-enter-left': {
    from: { opacity: 0, transform: `translateX(-${DISTANCE}px)` },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
  '@keyframes date-navigator-enter-right': {
    from: { opacity: 0, transform: `translateX(${DISTANCE}px)` },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
  '@keyframes date-navigator-exit-left': {
    from: { opacity: 1, transform: 'translateX(0)' },
    to: { opacity: 0, transform: `translateX(-${DISTANCE}px)` },
  },
  '@keyframes date-navigator-exit-right': {
    from: { opacity: 1, transform: 'translateX(0)' },
    to: { opacity: 0, transform: `translateX(${DISTANCE}px)` },
  },
};

type Model = {
  value: string;
  badgeVisible: boolean;
  seq: number;
  direction: DateNavigatorDirection;
  exiting: {
    seq: number;
    value: string;
    badgeVisible: boolean;
    direction: DateNavigatorDirection;
  } | null;
};

const DateNavigator = ({
  value,
  onBack,
  onNext,
  disableBack,
  disableNext,
  labelClassName = 'h2',
  labelMinWidth,
  badgeText,
  badgeVisible = false,
  badgeAction,
  truncateLabel = false,
  sx,
}: DateNavigatorType) => {
  const { t } = useAppTranslation();
  const { mobile400Down } = useBreakpoints();
  const compact = !!badgeText && mobile400Down;
  const constrained = compact || truncateLabel;
  const labelBleed = BLEED - (compact ? 4 : 0);

  const theme = useTheme();

  const isRtl = theme.direction === 'rtl';

  const directionRef = useRef<DateNavigatorDirection>('next');

  const [model, setModel] = useState<Model>({
    value,
    badgeVisible,
    seq: 0,
    direction: 'next',
    exiting: null,
  });

  const backActive = !disableBack && !!onBack;
  const nextActive = !disableNext && !!onNext;

  if (model.value !== value || model.badgeVisible !== badgeVisible) {
    setModel((prev) => ({
      value,
      badgeVisible,
      seq: prev.seq + 1,
      direction: directionRef.current,
      exiting: {
        seq: prev.seq + 1,
        value: prev.value,
        badgeVisible: prev.badgeVisible,
        direction: directionRef.current,
      },
    }));
  }

  useEffect(() => {
    if (!model.exiting) return;

    const exitingSeq = model.exiting.seq;

    const id = setTimeout(() => {
      setModel((prev) =>
        prev.exiting?.seq === exitingSeq ? { ...prev, exiting: null } : prev
      );
    }, DURATION);

    return () => clearTimeout(id);
  }, [model.exiting]);

  const swapping = model.exiting !== null;

  const enterSide = (direction: DateNavigatorDirection) => {
    const side = direction === 'next' ? 'right' : 'left';

    if (!isRtl) return side;

    return side === 'right' ? 'left' : 'right';
  };

  const exitSide = (direction: DateNavigatorDirection) =>
    enterSide(direction) === 'right' ? 'left' : 'right';

  const handleBack = () => {
    directionRef.current = 'back';
    onBack?.();
  };

  const handleNext = () => {
    directionRef.current = 'next';
    onNext?.();
  };

  const arrowStyles = {
    padding: '8px',
    margin: 0,
    borderRadius: 'var(--radius-l)',
    flexShrink: 0,
    position: 'relative',
    zIndex: 1,
    transition: `background-color var(--motion-hover) var(--ease-standard), transform ${DURATION}ms ${EASING}`,
    '&:active': { transform: 'scale(0.88)' },
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
      '&:active': { transform: 'none' },
    },
  };

  const labelContent = (
    label: string,
    showBadge: boolean,
    interactive = true
  ) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: compact ? '4px' : '8px',
        minWidth: 0,
        maxWidth: '100%',
      }}
    >
      <Typography
        className={compact ? 'h3' : labelClassName}
        sx={{
          minWidth: 0,
          textAlign: 'center',
          whiteSpace: 'nowrap',
          overflow: constrained ? 'hidden' : undefined,
          textOverflow: constrained ? 'ellipsis' : undefined,
        }}
      >
        {label}
      </Typography>
      {badgeText && badgeAction ? (
        <PeriodBadge
          text={badgeText}
          current={showBadge}
          action={badgeAction}
          interactive={interactive}
        />
      ) : badgeText && showBadge ? (
        <Badge
          size="small"
          color="accent"
          faded
          text={badgeText}
          sx={{ whiteSpace: 'nowrap' }}
        />
      ) : null}
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: compact ? '4px' : '8px',
        ...keyframes,
        ...sx,
      }}
    >
      <ButtonIcon
        edge={false}
        disabled={!backActive}
        aria-label={t('tr_back')}
        onClick={handleBack}
        sx={arrowStyles}
      >
        <IconNavigateLeft
          color={backActive ? 'var(--black)' : 'var(--grey-300)'}
        />
      </ButtonIcon>

      <Box
        sx={{
          position: 'relative',
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          minWidth: constrained ? 0 : labelMinWidth,
          width: truncateLabel ? labelMinWidth : undefined,
          boxSizing: 'content-box',
          paddingInline: `${labelBleed}px`,
          marginInline: `-${labelBleed}px`,
          pointerEvents: 'none',
          maskImage: swapping ? EDGE_FADE : 'none',
          WebkitMaskImage: swapping ? EDGE_FADE : 'none',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: constrained ? 'minmax(0, 1fr)' : undefined,
            alignItems: 'center',
            minWidth: 0,
            width: constrained ? '100%' : undefined,
          }}
        >
          {badgeText && !badgeAction && (
            <Box aria-hidden sx={{ gridArea: '1 / 1', visibility: 'hidden' }}>
              {labelContent(model.value, true)}
            </Box>
          )}
          <Box
            key={`in-${model.seq}`}
            sx={{
              gridArea: '1 / 1',
              animation:
                model.seq > 0
                  ? `date-navigator-enter-${enterSide(model.direction)} ${DURATION}ms ${EASING}`
                  : 'none',
              '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
            }}
          >
            {labelContent(model.value, model.badgeVisible)}
          </Box>
        </Box>

        {model.exiting && (
          <Box
            aria-hidden
            inert
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <Box
              key={`out-${model.exiting.seq}`}
              sx={{
                animation: `date-navigator-exit-${exitSide(model.exiting.direction)} ${DURATION}ms ${EASING} forwards`,
                '@media (prefers-reduced-motion: reduce)': {
                  animation: 'none',
                  opacity: 0,
                },
              }}
            >
              {labelContent(
                model.exiting.value,
                model.exiting.badgeVisible,
                false
              )}
            </Box>
          </Box>
        )}
      </Box>

      <ButtonIcon
        edge={false}
        disabled={!nextActive}
        aria-label={t('tr_next')}
        onClick={handleNext}
        sx={arrowStyles}
      >
        <IconNavigateRight
          color={nextActive ? 'var(--black)' : 'var(--grey-300)'}
        />
      </ButtonIcon>
    </Box>
  );
};

export default DateNavigator;
