import { Box, ButtonBase, useTheme } from '@mui/material';
import { cloneElement, KeyboardEvent, useRef } from 'react';
import { TabSwitcherOption, TabSwitcherProps } from './index.types';

/** Reusable segmented tab control. */
const TabSwitcher = <T extends string = string>({
  options,
  value,
  onChange,
  ariaLabel,
  sx,
}: TabSwitcherProps<T>) => {
  const theme = useTheme();
  const listRef = useRef<HTMLDivElement>(null);
  const activeIndex = options.findIndex((option) => option.value === value);
  const gap = 8;
  const enabledIndexes = options.flatMap((option, index) =>
    option.disabled ? [] : [index]
  );
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key) ||
      enabledIndexes.length === 0
    )
      return;
    const tabs = [
      ...(listRef.current?.querySelectorAll<HTMLButtonElement>(
        '[role="tab"]'
      ) ?? []),
    ];
    const current = tabs.findIndex((tab) => tab.contains(event.target as Node));
    const position = Math.max(0, enabledIndexes.indexOf(current));
    const forward =
      theme.direction === 'rtl'
        ? event.key === 'ArrowLeft'
        : event.key === 'ArrowRight';
    let next: number | undefined;
    if (event.key === 'Home') next = enabledIndexes[0];
    else if (event.key === 'End') next = enabledIndexes.at(-1);
    else {
      const offset = forward ? 1 : -1;
      next =
        enabledIndexes[
          (position + offset + enabledIndexes.length) % enabledIndexes.length
        ];
    }
    if (next === undefined) return;
    event.preventDefault();
    onChange(options[next]!.value);
    tabs[next]?.focus();
  };

  return (
    <Box
      ref={listRef}
      onKeyDown={handleKeyDown}
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
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          top: '4px',
          bottom: '4px',
          insetInlineStart: '4px',
          width: `calc((100% - ${(options.length - 1) * gap + 8}px) / ${options.length})`,
          borderRadius: 'var(--radius-m)',
          backgroundColor: 'var(--accent-200)',
          border: '1px solid var(--accent-main)',
          transform: `translateX(calc(${Math.max(activeIndex, 0) * (theme.direction === 'rtl' ? -1 : 1)} * (100% + ${gap}px)))`,
          transition: 'transform var(--motion-fast) var(--ease-standard)',
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
          opacity: activeIndex === -1 ? 0 : 1,
        }}
      />

      {options.map((option: TabSwitcherOption<T>, index) => {
        const isActive = option.value === value;

        return (
          <ButtonBase
            key={option.value}
            role="tab"
            className={isActive ? 'h4' : 'body-regular'}
            aria-selected={isActive}
            tabIndex={
              isActive || (activeIndex === -1 && index === enabledIndexes[0])
                ? 0
                : -1
            }
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
              color: isActive ? 'var(--accent-dark)' : 'var(--accent-400)',
              transition: 'color var(--motion-fast) var(--ease-standard)',
              '&.Mui-disabled': { opacity: 0.5 },
              '& svg, & svg g, & svg g path': {
                fill: isActive ? 'var(--accent-dark)' : 'var(--accent-400)',
                transition: 'fill var(--motion-fast) var(--ease-standard)',
              },
              '@media (prefers-reduced-motion: reduce)': {
                transition: 'none',
                '& svg, & svg g, & svg g path': { transition: 'none' },
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
