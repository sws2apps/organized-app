import { forwardRef, useImperativeHandle, useRef } from 'react';
import { keyframes } from '@emotion/react';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { PinInputContainer } from './index.styles';
import useShuffledSymbols from './useShuffledSymbols';
import { PIN_SYMBOLS } from './pinSymbols';

type PinInputVariant = 'default' | 'success' | 'error';

type PinInputProps = {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: number;
  variant?: PinInputVariant;
  autoFocus?: boolean;
};

export type PinInputHandle = {
  focus: () => void;
};

const isDigit = (text: string) => /^\d$/.test(text);

// The symbol is rendered as a CSS mask over the input's background color, so the
// shape's color is driven by a CSS variable (var(--accent-main) / var(--red-dark))
// and follows the active theme. The mask only needs an opaque fill.
const pinSymbolMask = (symbolIndex: number): string => {
  const symbol = PIN_SYMBOLS[symbolIndex % PIN_SYMBOLS.length];
  const inner = symbol.inner.replaceAll('{{C}}', '000');
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${symbol.viewBox}'>${inner}</svg>`;
  return `url("data:image/svg+xml;utf8,${svg}")`;
};

const ANIMATION_DURATION = '180ms';
const ANIMATION_EASING = 'cubic-bezier(0.25, 0.1, 0.25, 1)';

const shakeError = keyframes`
  0%   { transform: translateX(0); }
  20%  { transform: translateX(-6px); }
  40%  { transform: translateX(5px); }
  60%  { transform: translateX(-3px); }
  80%  { transform: translateX(2px); }
  100% { transform: translateX(0); }
`;

const PinInput = forwardRef<PinInputHandle, PinInputProps>(
  (
    {
      value,
      onChange,
      onComplete,
      length = 4,
      variant = 'default',
      autoFocus = true,
    },
    ref
  ) => {
    const isError = variant === 'error';
    const symbolOrder = useShuffledSymbols(length, value, PIN_SYMBOLS.length);
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

    return (
      <PinInputContainer
        ref={containerRef}
        sx={
          isError ? { animation: `${shakeError} 320ms ease-in-out` } : undefined
        }
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
          const symbolIndex = symbolOrder[index] ?? index;

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
                width: 52,
                height: 52,
                padding: 0,
                borderRadius: 'var(--radius-l)',
                textAlign: 'center',
                backgroundColor: isError
                  ? 'var(--red-dark)'
                  : 'var(--accent-main)',
                WebkitMaskImage: pinSymbolMask(symbolIndex),
                maskImage: pinSymbolMask(symbolIndex),
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
                WebkitMaskSize: '16px 16px',
                maskSize: '16px 16px',

                opacity: filled ? 1 : 0,
                transform: filled ? 'scale(1) rotate(0deg)' : 'scale(0.7) rotate(-25deg)',
                transition: `all ${ANIMATION_DURATION} ${ANIMATION_EASING}`,

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
                '& fieldset': {
                  border: `1px solid var(${borderColor(filled)})`,
                  borderRadius: 'var(--radius-l)',
                },
                '&.Mui-focused fieldset': {
                  border: `1px solid var(${
                    isError ? '--red-dark' : '--accent-main'
                  })`,
                },
                '&:hover fieldset': {
                  border: `1px solid var(${
                    isError ? '--red-dark' : '--accent-main'
                  })`,
                },
              },
            },
          };
        }}
      />
    </PinInputContainer>
    );
  }
);

PinInput.displayName = 'PinInput';

export default PinInput;
