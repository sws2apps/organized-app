import { FC } from 'react';
import { Box } from '@mui/material';
import Typography from '@components/typography';
import { IconCheck } from '@components/icons';
import { ColorSchemeType } from '@definition/app';
import { ColorSchemeSelectorType } from './index.types';

const COLOR_SCHEME_BASE_COLORS: Record<ColorSchemeType, string> = {
  blue: '80, 101, 208',
  green: '90, 155, 74',
  purple: '123, 94, 183',
  orange: '226, 156, 20',
  teal: '20, 138, 148',
  rose: '236, 72, 153',
  slate: '110, 125, 145',
};

export const ColorSchemeContainer: FC<ColorSchemeSelectorType> = ({
  value,
  selected,
  label,
  onClick,
}) => {
  const isSelected = value === selected;
  const baseColor = COLOR_SCHEME_BASE_COLORS[value];

  const solidColor = `rgba(${baseColor}, 1)`;
  const tintColor = `rgba(${baseColor}, 0.08)`;
  const hoverTintColor = `rgba(${baseColor}, 0.12)`;

  return (
    <Box
      role="radio"
      aria-checked={isSelected}
      aria-label={label}
      tabIndex={0}
      onClick={() => onClick(value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(value);
        }
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '6px 20px 6px 6px',
        borderRadius: '32px',
        border: isSelected
          ? `1px solid ${solidColor}`
          : '1px solid var(--grey-200)',
        backgroundColor: isSelected ? tintColor : 'transparent',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        outline: 'none',
        '&:focus-visible': {
          boxShadow: `0 0 0 2px ${solidColor}`,
        },
        '&:hover': {
          backgroundColor: isSelected ? hoverTintColor : 'var(--accent-150)',
          borderColor: isSelected ? solidColor : 'var(--grey-300)',
        },
      }}
    >
      <Box
        aria-hidden="true"
        sx={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: solidColor,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isSelected && (
          <IconCheck
            color="var(--always-white)"
            sx={{ width: '18px', height: '18px' }}
          />
        )}
      </Box>
      <Typography
        className="body-regular"
        sx={{
          color: isSelected ? solidColor : 'var(--black)',
          fontWeight: isSelected ? 500 : 400,
          lineHeight: 1,
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};
