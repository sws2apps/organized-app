import { forwardRef, useImperativeHandle, useRef } from 'react';
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

    return (
      <PinInputContainer
        ref={containerRef}
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
          const filled = !!value[index];
          const Icon = PIN_ICONS[(symbolOrder[index] ?? index) % PIN_ICONS.length];

          return (
            <Box
              key={index}
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
                  transition: `all ${ANIMATION_DURATION} ${ANIMATION_EASING}`,
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
