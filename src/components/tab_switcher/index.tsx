import { Box, ButtonBase, useTheme } from '@mui/material';
import { cloneElement, KeyboardEvent, useId, useRef } from 'react';
import {
  TabSwitcherOption,
  TabSwitcherProps,
} from '@components/tab_switcher/index.types';

/** Reusable segmented tab control. */
const TabSwitcher = <T extends string = string>({
  options,
  value,
  onChange,
  ariaLabel,
  id,
  wrapLabels = false,
  surface = 'tinted',
  sx,
}: TabSwitcherProps<T>) => {
  const generatedId = useId();
  const tabId = id ?? generatedId;
  const { direction } = useTheme();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const handleKeyDown = (event: KeyboardEvent, index: number) => {
    const enabled = options.flatMap((option, i) =>
      option.disabled ? [] : [i]
    );
    if (!enabled.length) return;
    const current = enabled.indexOf(index);
    let next: number;
    switch (event.key) {
      case 'Home':
        next = enabled[0];
        break;
      case 'End':
        next = enabled.at(-1)!;
        break;
      case 'ArrowRight':
      case 'ArrowLeft': {
        const forward = (event.key === 'ArrowRight') !== (direction === 'rtl');
        next =
          enabled[
            (current + (forward ? 1 : -1) + enabled.length) % enabled.length
          ];
        break;
      }
      default:
        return;
    }
    event.preventDefault();
    buttons.current[next]?.focus();
    onChange(options[next].value);
  };
  const activeIndex = options.findIndex((option) => option.value === value);
  const focusIndex = options.findIndex(
    (option) => option.value === value && !option.disabled
  );
  const tabbableIndex =
    focusIndex === -1
      ? options.findIndex((option) => !option.disabled)
      : focusIndex;
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
        backgroundColor:
          surface === 'light' ? 'var(--accent-100)' : 'var(--accent-150)',
        border: '1px solid var(--accent-200)',
        ...sx,
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: '4px',
          bottom: '4px',
          insetInlineStart: '4px',
          width: `calc((100% - ${(options.length - 1) * gap + 8}px) / ${options.length})`,
          borderRadius: 'var(--radius-m)',
          backgroundColor:
            surface === 'light' ? 'var(--accent-150)' : 'var(--accent-200)',
          border: `1px solid ${surface === 'light' ? 'var(--accent-300)' : 'var(--accent-main)'}`,
          transform: `translateX(calc(${(direction === 'rtl' ? -1 : 1) * Math.max(activeIndex, 0)} * (100% + ${gap}px)))`,
          transition: 'transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
          opacity: activeIndex === -1 ? 0 : 1,
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        }}
      />

      {options.map((option: TabSwitcherOption<T>, index) => {
        const isActive = option.value === value;

        return (
          <ButtonBase
            key={option.value}
            role="tab"
            id={`${tabId}-${option.value}`}
            aria-controls={option.panelId}
            tabIndex={index === tabbableIndex ? 0 : -1}
            ref={(node: HTMLButtonElement | null) => {
              buttons.current[index] = node;
            }}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={
              surface === 'light'
                ? isActive
                  ? 'body-small-semibold'
                  : 'body-small-regular'
                : isActive
                  ? 'h4'
                  : 'body-regular'
            }
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
              padding: surface === 'light' ? '4px 12px' : '4px 16px',
              minHeight: '28px',
              borderRadius: 'var(--radius-m)',
              fontFamily: 'inherit',
              color: isActive ? 'var(--accent-dark)' : 'var(--accent-400)',
              transition: 'color 0.16s ease-out',
              '&.Mui-disabled': { opacity: 0.5 },
              '@media (prefers-reduced-motion: reduce)': {
                transition: 'none',
                '& svg, & svg g, & svg g path': { transition: 'none' },
              },
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
            <Box
              component="span"
              sx={{
                minWidth: 0,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: wrapLabels ? 'normal' : 'nowrap',
                overflowWrap: wrapLabels ? 'anywhere' : undefined,
              }}
            >
              {option.label}
            </Box>
            {option.badge}
          </ButtonBase>
        );
      })}
    </Box>
  );
};

export default TabSwitcher;
