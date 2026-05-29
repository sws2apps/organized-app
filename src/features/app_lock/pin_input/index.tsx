import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { keyframes } from '@emotion/react';
import { Box } from '@mui/material';
import { MuiOtpInput } from 'mui-one-time-password-input';
import {
  IconPinSymbolSquare,
  IconPinSymbolTriangle,
  IconPinSymbolStar,
  IconPinSymbolSquircle,
  IconPinSymbolCog,
  IconPinSymbolHexagon,
} from '@icons/index';
import { PinInputContainer } from './index.styles';
import useShuffledSymbols from './useShuffledSymbols';

const PIN_ICONS = [
  IconPinSymbolSquare,
  IconPinSymbolTriangle,
  IconPinSymbolStar,
  IconPinSymbolSquircle,
  IconPinSymbolCog,
  IconPinSymbolHexagon,
] as const;

const CELL_SIZE = 52;
const CELL_GAP = 8;
const SYMBOL_SIZE = 20;

type PinInputVariant = 'default' | 'success' | 'error';

type PinInputProps = {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  onSubmit?: () => void;
  length?: number;
  variant?: PinInputVariant;
  autoFocus?: boolean;
};

export type PinInputHandle = {
  focus: () => void;
};

const isDigit = (text: string) => /^\d$/.test(text);

const ANIMATION_DURATION = '180ms';
const ANIMATION_EASING = 'cubic-bezier(0.25, 0.1, 0.25, 1)';
const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';

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

const PinInput = forwardRef<PinInputHandle, PinInputProps>(
  (
    {
      value,
      onChange,
      onComplete,
      onSubmit,
      length = 4,
      variant = 'default',
      autoFocus = true,
    },
    ref
  ) => {
    const isError = variant === 'error';
    const symbolOrder = useShuffledSymbols(length, value, PIN_ICONS.length);
    const containerRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        containerRef.current?.querySelector('input')?.focus();
      },
    }));

    const borderColor = (filled: boolean) => {
      if (isError) return '--red-dark';
      if (variant === 'success') return '--accent-main';
      return filled ? '--accent-main' : '--accent-300';
    };

    const handleKeyDownCapture = useCallback(
      (e: React.KeyboardEvent) => {
        // Enter key: submit when PIN is fully filled
        if (e.key === 'Enter') {
          if (value.length >= length && onSubmit) {
            e.preventDefault();
            onSubmit();
          }
          return;
        }

        if (e.key !== 'Backspace') return;
        if (value.length === 0) return;

        // Intercept ALL backspace events in the capture phase, before
        // MuiOtpInput's internal handler runs. This prevents the
        // library's two-press delete behavior (first press moves focus,
        // second press actually deletes).
        e.preventDefault();
        e.stopPropagation();
        e.nativeEvent.stopImmediatePropagation();

        const newValue = value.slice(0, -1);
        onChange(newValue);

        requestAnimationFrame(() => {
          const inputs = containerRef.current?.querySelectorAll('input');
          inputs?.[Math.max(0, newValue.length)]?.focus();
        });
      },
      [value, length, onChange, onSubmit]
    );

    const handleMouseDownCapture = useCallback(
      (e: React.MouseEvent) => {
        // Prevent MuiOtpInput from moving focus to the clicked cell.
        // Always keep focus on the correct (next empty) cell.
        const target = e.target as HTMLElement;
        if (target.tagName === 'INPUT') {
          e.preventDefault();
          const inputs = containerRef.current?.querySelectorAll('input');
          const correctIndex = Math.min(value.length, length - 1);
          inputs?.[correctIndex]?.focus();
        }
      },
      [value, length]
    );

    return (
      <PinInputContainer
        ref={containerRef}
        role="group"
        aria-label={`PIN input, ${value.length} of ${length} digits entered`}
        onKeyDownCapture={handleKeyDownCapture}
        onMouseDownCapture={handleMouseDownCapture}
        sx={{
          position: 'relative',
          ...(isError
            ? { animation: `${shakeError} 320ms ease-in-out` }
            : {}),
        }}
      >
      <MuiOtpInput
        value={value}
        onChange={onChange}
        onComplete={onComplete}
        length={length}
        autoFocus={autoFocus}
        display="flex"
        gap={1}
        validateChar={isDigit}
        TextFieldsProps={(index) => {
          const filled = !!value[index];

          return {
            autoComplete: 'off',
            type: 'tel',
            inputProps: {
              inputMode: 'numeric',
              pattern: '[0-9]*',
              autoComplete: 'off',
              'aria-label': `PIN digit ${index + 1}`,
            },
            sx: {
              '.MuiOutlinedInput-input': {
                color: 'transparent',
                caretColor: 'transparent',
                WebkitTextSecurity: 'none',
                width: CELL_SIZE,
                height: CELL_SIZE,
                padding: 0,
                borderRadius: 'var(--radius-l)',
                textAlign: 'center',

                '&::selection': {
                  backgroundColor: 'transparent',
                  color: 'transparent',
                },
                '&::-moz-selection': {
                  backgroundColor: 'transparent',
                  color: 'transparent',
                },
              },
              '.MuiOutlinedInput-root': {
                cursor: 'default',
                animation: filled ? `${cellPop} 220ms ${SPRING} both` : 'none',
                '& fieldset': {
                  border: `1px solid var(${borderColor(filled)})`,
                  borderRadius: 'var(--radius-l)',
                  transition: 'border-color 150ms ease',
                },
                '&.Mui-focused fieldset': {
                  border: `1px solid var(${
                    isError ? '--red-dark' : '--accent-main'
                  })`,
                },
                '&:hover fieldset': {
                  border: `1px solid var(${borderColor(filled)})`,
                },
                '&.Mui-focused:hover fieldset': {
                  border: `1px solid var(${
                    isError ? '--red-dark' : '--accent-main'
                  })`,
                },
              },
            },
          };
        }}
      />
      <Box
        aria-hidden
        sx={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          gap: `${CELL_GAP}px`,
          pointerEvents: 'none',
        }}
      >
        {Array.from({ length }).map((_, index) => {
          const symbolIndex = symbolOrder[index] ?? index;
          const filled = !!value[index];
          const Icon = PIN_ICONS[symbolIndex % PIN_ICONS.length];

          return (
            <Box
              key={`pin-symbol-${symbolIndex}`}
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
                color={isError ? 'var(--red-dark)' : 'var(--accent-main)'}
                sx={{
                  opacity: filled ? 1 : 0,
                  transform: filled
                    ? 'scale(1) rotate(0deg)'
                    : 'scale(0.7) rotate(-25deg)',
                  transition: [
                    `opacity ${ANIMATION_DURATION} ${ANIMATION_EASING}`,
                    `transform 220ms ${SPRING}`,
                  ].join(', '),
                  '& > svg': { width: '100%', height: '100%' },
                }}
              />
            </Box>
          );
        })}
      </Box>
    </PinInputContainer>
    );
  }
);

PinInput.displayName = 'PinInput';

export default PinInput;
