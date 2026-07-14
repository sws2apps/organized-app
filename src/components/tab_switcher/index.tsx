import { Box, ButtonBase } from '@mui/material';
import { cloneElement } from 'react';
import { TabSwitcherOption, TabSwitcherProps } from './index.types';

/**
 * Segmented control that switches between a small set of options, each with an
 * optional icon and a text label. A single highlight slides between the
 * segments to indicate the active one.
 *
 * Reusable across the app — e.g. present / online counts, list filters, view
 * toggles. Generic over the option value type for exact `value` / `onChange`
 * typing.
 */
const TabSwitcher = <T extends string = string>({
  options,
  value,
  onChange,
  ariaLabel,
  sx,
}: TabSwitcherProps<T>) => {
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
        backgroundColor: 'var(--accent-150)',
        border: '1px solid var(--accent-200)',
        ...sx,
      }}
    >
      {/* Sliding highlight behind the active segment. */}
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: '4px',
          bottom: '4px',
          left: '4px',
          width: `calc((100% - ${(options.length - 1) * gap + 8}px) / ${options.length})`,
          borderRadius: 'var(--radius-m)',
          backgroundColor: 'var(--accent-200)',
          border: '1px solid var(--accent-main)',
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
              gap: '8px',
              padding: '4px 16px',
              minHeight: '28px',
              borderRadius: 'var(--radius-m)',
              fontFamily: 'inherit',
              fontSize: '15px',
              lineHeight: '20px',
              fontWeight: isActive ? 500 : 400,
              color: isActive ? 'var(--accent-dark)' : 'var(--accent-400)',
              // Text and icon share the exact same transition so the label and
              // the glyph recolor together — no lagging icon paint.
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
                {cloneElement(option.icon, { width: 20, height: 20 })}
              </Box>
            )}
            {/* Labels truncate with an ellipsis when the segments get too
                narrow for a long (translated) word, so text never overflows. */}
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
