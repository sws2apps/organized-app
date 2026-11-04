import {
  KeyboardEvent,
  MouseEvent,
  Ref,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
} from 'react';
import { keyframes } from '@emotion/react';
import { Box } from '@mui/material';
import { MuiOtpInput } from 'mui-one-time-password-input';
import {
  IconPinSymbolCog,
  IconPinSymbolHexagon,
  IconPinSymbolSquare,
  IconPinSymbolSquircle,
  IconPinSymbolStar,
  IconPinSymbolTriangle,
} from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import { APP_LOCK_PIN_LENGTH } from '@constants/index';
import Typography from '@components/typography';
import { PinCells, PinField, PinSymbols } from './index.styles';
import useShuffledSymbols from './useShuffledSymbols';

const PIN_ICONS = [
  IconPinSymbolSquare,
  IconPinSymbolTriangle,
  IconPinSymbolStar,
  IconPinSymbolSquircle,
  IconPinSymbolCog,
  IconPinSymbolHexagon,
];

const CELL_SIZE = 52;
const CELL_GAP = 8;
const SYMBOL_SIZE = 20;
const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const REDUCED_MOTION = '@media (prefers-reduced-motion: reduce)';

const shakeError = keyframes`
  0%   { transform: translateX(0); }
  20%  { transform: translateX(-6px); }
  40%  { transform: translateX(5px); }
  60%  { transform: translateX(-3px); }
  80%  { transform: translateX(2px); }
  100% { transform: translateX(0); }
`;

const cellPop = keyframes`
  0%   { transform: scale(1); }
  40%  { transform: scale(1.07); }
  100% { transform: scale(1); }
`;

export type PinInputHandle = {
  focus: VoidFunction;
};

type PinInputProps = {
  ref?: Ref<PinInputHandle>;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  onSubmit?: VoidFunction;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  autoFocus?: boolean;
};

const isDigit = (text: string) => /^\d$/.test(text);

const PinInput = ({
  ref,
  value,
  onChange,
  onComplete,
  onSubmit,
  error = false,
  helperText = '',
  disabled = false,
  autoFocus = false,
}: PinInputProps) => {
  const { t } = useAppTranslation();

  const length = APP_LOCK_PIN_LENGTH;
  const symbolOrder = useShuffledSymbols(length, value, PIN_ICONS.length);
  const cellsRef = useRef<HTMLDivElement>(null);
  const helperId = useId();

  const focusCell = (index: number) => {
    cellsRef.current?.querySelectorAll('input')[index]?.focus();
  };

  useImperativeHandle(ref, () => ({
    focus: () => focusCell(Math.min(value.length, length - 1)),
  }));

  useEffect(() => {
    // a cleared entry, e.g. after a wrong PIN, starts again at the first cell
    if (value === '' && cellsRef.current?.contains(document.activeElement)) {
      focusCell(0);
    }
  }, [value]);

  const accent = error ? 'var(--red-dark)' : 'var(--accent-main)';

  const handleKeyDownCapture = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (value.length === length && onSubmit) {
        e.preventDefault();
        onSubmit();
      }
      return;
    }

    if (e.key !== 'Backspace' || value.length === 0) return;

    // MuiOtpInput clears the focused cell first and needs a second press to go back
    e.preventDefault();
    e.stopPropagation();

    const next = value.slice(0, -1);
    onChange(next);
    requestAnimationFrame(() => focusCell(next.length));
  };

  // cells fill in order, so a click anywhere lands on the next empty one
  const handleMouseDownCapture = (e: MouseEvent) => {
    if ((e.target as HTMLElement).tagName !== 'INPUT') return;

    e.preventDefault();
    focusCell(Math.min(value.length, length - 1));
  };

  return (
    <PinField>
      <PinCells
        ref={cellsRef}
        role="group"
        aria-label={t('tr_PINInputLabel', { entered: value.length, length })}
        onKeyDownCapture={handleKeyDownCapture}
        onMouseDownCapture={handleMouseDownCapture}
        sx={{
          animation: error ? `${shakeError} 320ms ease-in-out` : 'none',
          [REDUCED_MOTION]: { animation: 'none' },
        }}
      >
        <MuiOtpInput
          value={value}
          onChange={onChange}
          onComplete={onComplete}
          length={length}
          autoFocus={autoFocus}
          validateChar={isDigit}
          sx={{ display: 'flex', gap: `${CELL_GAP}px` }}
          TextFieldsProps={(index) => {
            const filled = !!value[index];

            let border = 'var(--accent-300)';
            if (error || filled) border = accent;
            if (disabled) border = 'var(--accent-200)';

            return {
              disabled,
              type: 'tel',
              autoComplete: 'off',
              slotProps: {
                htmlInput: {
                  inputMode: 'numeric',
                  pattern: '[0-9]*',
                  'aria-label': t('tr_PINDigitLabel', { position: index + 1 }),
                  'aria-describedby': helperText ? helperId : undefined,
                },
              },
              sx: {
                '.MuiOutlinedInput-root': {
                  cursor: 'default',
                  backgroundColor: disabled
                    ? 'var(--accent-150)'
                    : 'transparent',
                  borderRadius: 'var(--radius-l)',
                  animation: filled
                    ? `${cellPop} 220ms ${SPRING} both`
                    : 'none',
                  [REDUCED_MOTION]: { animation: 'none' },
                  '& fieldset, &:hover fieldset, &.Mui-disabled fieldset': {
                    border: `1px solid ${border}`,
                    borderRadius: 'var(--radius-l)',
                    transition: 'border-color 150ms ease',
                  },
                  '&.Mui-focused fieldset, &.Mui-focused:hover fieldset': {
                    border: `1px solid ${accent}`,
                  },
                },
                // the digit stays hidden; the symbol overlay shows progress
                '.MuiOutlinedInput-input': {
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  padding: 0,
                  textAlign: 'center',
                  color: 'transparent',
                  caretColor: 'transparent',
                  '&::selection': { backgroundColor: 'transparent' },
                },
              },
            };
          }}
        />

        <PinSymbols aria-hidden sx={{ gap: `${CELL_GAP}px` }}>
          {symbolOrder.map((symbolIndex, index) => {
            const Icon = PIN_ICONS[symbolIndex];
            const filled = !!value[index];

            return (
              <Box
                key={symbolIndex}
                sx={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon
                  width={SYMBOL_SIZE}
                  height={SYMBOL_SIZE}
                  color={accent}
                  sx={{
                    opacity: filled ? 1 : 0,
                    transform: filled
                      ? 'scale(1) rotate(0deg)'
                      : 'scale(0.7) rotate(-25deg)',
                    transition: `opacity 180ms ease, transform 220ms ${SPRING}`,
                    [REDUCED_MOTION]: { transform: 'none', transition: 'none' },
                  }}
                />
              </Box>
            );
          })}
        </PinSymbols>
      </PinCells>

      <Typography
        id={helperId}
        className="body-small-regular"
        role="alert"
        sx={{
          color: 'var(--red-dark)',
          minHeight: '20px',
          textAlign: 'center',
        }}
      >
        {helperText}
      </Typography>
    </PinField>
  );
};

export default PinInput;
