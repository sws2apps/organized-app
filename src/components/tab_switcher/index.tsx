import { Box, ButtonBase } from '@mui/material';
import { cloneElement } from 'react';
import {
  TabSwitcherOption,
  TabSwitcherProps,
  TabSwitcherSurface,
} from './index.types';

const PALETTE: Record<
  TabSwitcherSurface,
  { track: string; trackBorder: string; thumb: string; thumbBorder: string }
> = {
  tinted: {
    track: 'var(--accent-150)',
    trackBorder: 'var(--accent-200)',
    thumb: 'var(--accent-200)',
    thumbBorder: 'var(--accent-main)',
  },
  // the tinted look one step lighter, with a softer outline, so on white and
  // other light backgrounds the switch doesn't outshine the content around it
  light: {
    track: 'var(--accent-100)',
    trackBorder: 'var(--accent-200)',
    thumb: 'var(--accent-150)',
    thumbBorder: 'var(--accent-300)',
  },
};

/** Reusable segmented tab control. */
const TabSwitcher = <T extends string = string>({
  options,
  value,
  onChange,
  ariaLabel,
  surface = 'tinted',
  sx,
}: TabSwitcherProps<T>) => {
  const palette = PALETTE[surface];

  const activeIndex = options.findIndex((option) => option.value === value);
  const gap = 8;

  return (
    <Box
      role="tablist"
      aria-label={ariaLabel}
      sx={{
        position: 'relative',
        display: 'flex',
        gap: `${gap}px`,
        padding: '4px',
        borderRadius: 'var(--radius-l)',
        backgroundColor: palette.track,
        border: `1px solid ${palette.trackBorder}`,
        ...sx,
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: '4px',
          bottom: '4px',
          left: '4px',
          width: `calc((100% - ${(options.length - 1) * gap + 8}px) / ${options.length})`,
          borderRadius: 'var(--radius-m)',
          backgroundColor: palette.thumb,
          border: `1px solid ${palette.thumbBorder}`,
          transform: `translateX(calc(${Math.max(activeIndex, 0)} * (100% + ${gap}px)))`,
          transition: 'transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
          opacity: activeIndex === -1 ? 0 : 1,
        }}
      />

      {options.map((option: TabSwitcherOption<T>) => {
        const isActive = option.value === value;

        return (
          <ButtonBase
            key={option.value}
            role="tab"
            className={isActive ? 'body-small-semibold' : 'body-small-regular'}
            aria-selected={isActive}
            disabled={option.disabled}
            disableRipple
            onClick={() => onChange(option.value)}
            sx={{
              position: 'relative',
              zIndex: 1,
              flex: 1,
              minWidth: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '4px 12px',
              minHeight: '28px',
              borderRadius: 'var(--radius-m)',
              fontFamily: 'inherit',
              color: isActive ? 'var(--accent-dark)' : 'var(--accent-400)',
              transition: 'color 0.16s ease-out',
              '&.Mui-disabled': { opacity: 0.5 },
              '& svg, & svg g, & svg g path': {
                fill: isActive ? 'var(--accent-dark)' : 'var(--accent-400)',
                transition: 'fill 0.16s ease-out',
              },
              '&:focus-visible': { outline: 'var(--accent-main) auto 1px' },
            }}
          >
            {option.icon && (
              <Box
                component="span"
                sx={{ display: 'inline-flex', flexShrink: 0 }}
              >
                {cloneElement(option.icon, { width: 18, height: 18 })}
              </Box>
            )}
            <Box
              component="span"
              sx={{
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {option.label}
            </Box>
          </ButtonBase>
        );
      })}
    </Box>
  );
};

export default TabSwitcher;
