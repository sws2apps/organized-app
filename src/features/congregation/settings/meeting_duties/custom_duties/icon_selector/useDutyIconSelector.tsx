import { KeyboardEvent, useRef } from 'react';
import { useBreakpoints } from '@hooks/index';
import { CUSTOM_DUTY_ICONS } from '@constants/duty_icons';
import { CustomDutyIconType } from '@definition/duties';
import { DutyIconSelectorProps } from './index.types';

const ICONS = Object.keys(CUSTOM_DUTY_ICONS) as Exclude<
  CustomDutyIconType,
  'default'
>[];

const useDutyIconSelector = ({ disabled, onChange }: DutyIconSelectorProps) => {
  const { mobile400Down } = useBreakpoints();
  const columns = mobile400Down ? 2 : 3;
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    if (disabled) return;
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const column = index % columns;
    const lastInColumn =
      ICONS.length - 1 - ((ICONS.length - 1 - column) % columns);
    const nextRow = index + columns < ICONS.length ? index + columns : column;
    const previousRow = index >= columns ? index - columns : lastInColumn;
    const steps: Record<string, number> = {
      ArrowRight: rtl ? -1 : 1,
      ArrowLeft: rtl ? 1 : -1,
      ArrowDown: nextRow - index,
      ArrowUp: previousRow - index,
      Home: -index,
      End: ICONS.length - 1 - index,
    };
    const step = steps[event.key];
    if (step === undefined) return;
    event.preventDefault();
    const next = (index + step + ICONS.length) % ICONS.length;
    onChange(ICONS[next]);
    buttons.current[next]?.focus();
  };

  return { icons: ICONS, buttons, columns, handleKeyDown };
};

export default useDutyIconSelector;
