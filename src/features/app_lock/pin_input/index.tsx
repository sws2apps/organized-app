import { FC } from 'react';
import { keyframes } from '@emotion/react';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { PinInputContainer } from './index.styles';
import useShuffledSymbols from './useShuffledSymbols';

type PinInputVariant = 'default' | 'success' | 'error';

type PinInputProps = {
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  length?: number;
  variant?: PinInputVariant;
  autoFocus?: boolean;
};

const isDigit = (text: string) => /^\d$/.test(text);

const ACCENT_HEX = '6A6AE3';
const RED_HEX = 'C70552';

const PIN_SYMBOL_PATHS: readonly string[] = [
  'M12 2 C12 9 15 12 22 12 C15 12 12 15 12 22 C12 15 9 12 2 12 C9 12 12 9 12 2 Z',
  'M12 2 L22 12 L12 22 L2 12 Z',
  'M12 2 L21 7 L21 17 L12 22 L3 17 L3 7 Z',
  'M12 12 m -9 0 a 9 9 0 1 0 18 0 a 9 9 0 1 0 -18 0',
];

const pinSymbolBackground = (symbolIndex: number, hex: string): string => {
  const path = PIN_SYMBOL_PATHS[symbolIndex % PIN_SYMBOL_PATHS.length];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='${path}' fill='%23${hex}'/></svg>`;
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

const PinInput: FC<PinInputProps> = ({
  value,
  onChange,
  onComplete,
  length = 4,
  variant = 'default',
  autoFocus = true,
}) => {
  const isError = variant === 'error';
  const symbolOrder = useShuffledSymbols(length, value);

  const borderColor = (filled: boolean) => {
    if (isError) return '--red-dark';
    if (variant === 'success') return '--accent-main';
    return filled ? '--accent-main' : '--accent-300';
  };

  return (
    <PinInputContainer
      sx={isError ? { animation: `${shakeError} 320ms ease-in-out` } : undefined}
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
          const hex = isError ? RED_HEX : ACCENT_HEX;
          const symbolIndex = symbolOrder[index] ?? index;

          return {
            autoComplete: 'off',
            type: 'tel',
            inputProps: {
              inputMode: 'numeric',
              pattern: '[0-9]*',
              'aria-label': `PIN digit ${index + 1}`,
            },
            sx: {
              '.MuiOutlinedInput-input': {
                color: 'transparent',
                caretColor: 'transparent',
                WebkitTextSecurity: 'none',
                width: 40,
                height: 40,
                padding: 0,
                borderRadius: 'var(--radius-l)',
                textAlign: 'center',
                backgroundImage: pinSymbolBackground(symbolIndex, hex),
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: '16px 16px',

                opacity: filled ? 1 : 0,
                transform: filled ? 'scale(1) rotate(0deg)' : 'scale(0.7) rotate(-25deg)',
                transition: `all ${ANIMATION_DURATION} ${ANIMATION_EASING}`,
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
};

export default PinInput;
