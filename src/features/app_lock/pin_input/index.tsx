import { FC } from 'react';
import { MuiOtpInput } from 'mui-one-time-password-input';
import { PinInputContainer } from './index.styles';

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

// Resolved hex of --accent-main and --red-dark for use inside data-URI SVGs
// (CSS variables don't substitute inside data URIs).
const ACCENT_HEX = '6A6AE3';
const RED_HEX = 'C70552';

// One decorative shape per box position. Position-deterministic (not
// digit-deterministic) so the icons never leak the PIN value to onlookers.
const PIN_SYMBOL_PATHS: readonly string[] = [
  // 0: 4-point sparkle with deep concave Bezier sides (Apple ✦-style)
  'M12 2 C12 9 15 12 22 12 C15 12 12 15 12 22 C12 15 9 12 2 12 C9 12 12 9 12 2 Z',
  // 1: diamond (rotated rounded square)
  'M12 2 L22 12 L12 22 L2 12 Z',
  // 2: filled regular hexagon
  'M12 2 L21 7 L21 17 L12 22 L3 17 L3 7 Z',
  // 3: filled circle
  'M12 12 m -9 0 a 9 9 0 1 0 18 0 a 9 9 0 1 0 -18 0',
];

const pinSymbolBackground = (index: number, hex: string): string => {
  const path = PIN_SYMBOL_PATHS[index % PIN_SYMBOL_PATHS.length];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path d='${path}' fill='%23${hex}'/></svg>`;
  return `url("data:image/svg+xml;utf8,${svg}")`;
};

const PinInput: FC<PinInputProps> = ({
  value,
  onChange,
  onComplete,
  length = 4,
  variant = 'default',
  autoFocus = true,
}) => {
  const isError = variant === 'error';

  const borderColor = (filled: boolean) => {
    if (isError) return '--red-dark';
    if (variant === 'success') return '--accent-main';
    return filled ? '--accent-main' : '--accent-300';
  };

  return (
    <PinInputContainer>
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

          return {
            autoComplete: 'off',
            type: 'password',
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
                backgroundImage: filled
                  ? pinSymbolBackground(index, hex)
                  : 'none',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: '16px 16px',
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
