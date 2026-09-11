import { useEffect, useRef, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { IconNavigateLeft, IconNavigateRight } from '@components/icons';
import { DateNavigatorDirection, DateNavigatorType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import ButtonIcon from '@components/icon_button';
import Typography from '@components/typography';

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
  seq: number;
  direction: DateNavigatorDirection;
  exiting: {
    seq: number;
    value: string;
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
  sx,
}: DateNavigatorType) => {
  const { t } = useAppTranslation();

  const theme = useTheme();

  const isRtl = theme.direction === 'rtl';

  const directionRef = useRef<DateNavigatorDirection>('next');

  const [model, setModel] = useState<Model>({
    value,
    seq: 0,
    direction: 'next',
    exiting: null,
  });

  const backActive = !disableBack && !!onBack;
  const nextActive = !disableNext && !!onNext;

  if (model.value !== value) {
    setModel((prev) => ({
      value,
      seq: prev.seq + 1,
      direction: directionRef.current,
      exiting: {
        seq: prev.seq + 1,
        value: prev.value,
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
    position: 'relative',
    zIndex: 1,
    transition: `transform ${DURATION}ms ${EASING}`,
    '&:active': { transform: 'scale(0.88)' },
    '@media (prefers-reduced-motion: reduce)': {
      transition: 'none',
      '&:active': { transform: 'none' },
    },
  };

  const labelStyles = {
    textAlign: 'center',
    whiteSpace: 'nowrap',
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: '8px',
        ...keyframes,
        ...sx,
      }}
    >
      <ButtonIcon
        disableHover
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
          minWidth: labelMinWidth,
          paddingInline: `${BLEED}px`,
          marginInline: `-${BLEED}px`,
          pointerEvents: 'none',
          maskImage: swapping ? EDGE_FADE : 'none',
          WebkitMaskImage: swapping ? EDGE_FADE : 'none',
        }}
      >
        <Typography
          key={`in-${model.seq}`}
          className={labelClassName}
          sx={{
            ...labelStyles,
            animation:
              model.seq > 0
                ? `date-navigator-enter-${enterSide(model.direction)} ${DURATION}ms ${EASING}`
                : 'none',
            '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
          }}
        >
          {model.value}
        </Typography>

        {model.exiting && (
          <Box
            aria-hidden
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              justifyContent: 'center',
              pointerEvents: 'none',
            }}
          >
            <Typography
              key={`out-${model.exiting.seq}`}
              className={labelClassName}
              sx={{
                ...labelStyles,
                animation: `date-navigator-exit-${exitSide(model.exiting.direction)} ${DURATION}ms ${EASING} forwards`,
                '@media (prefers-reduced-motion: reduce)': {
                  animation: 'none',
                  opacity: 0,
                },
              }}
            >
              {model.exiting.value}
            </Typography>
          </Box>
        )}
      </Box>

      <ButtonIcon
        disableHover
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
