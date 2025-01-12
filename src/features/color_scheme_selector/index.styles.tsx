import { FC } from 'react';
import { FormControlLabel, Radio, RadioProps } from '@mui/material';
import { IconCheck } from '@components/icons';
import { ColorSchemeType } from '@definition/app';
import { ColorSchemeSelectorType } from './index.types';
import Typography from '@components/typography';

const ColorSchemeSwitch: FC<RadioProps> = (props) => {
  return (
    <Radio
      {...props}
      disableRipple
      checkedIcon={<IconCheck color="var(--always-white)" />}
      sx={{ color: 'var(--always-white)' }}
    />
  );
};

export const ColorSchemeContainer: FC<ColorSchemeSelectorType> = (props) => {
  const value = props.value as ColorSchemeType;
  const selected = props.selected as ColorSchemeType;
  const label = props.label;

  const isSelected = value === selected;

  let backgroundColor: string;

  if (value === 'blue') {
    backgroundColor = 'rgba(80, 101, 208, 1)';
  }

  if (value === 'green') {
    backgroundColor = 'rgba(90, 155, 74, 1)';
  }

  if (value === 'purple') {
    backgroundColor = 'rgba(123, 94, 183, 1)';
  }

  if (value === 'orange') {
    backgroundColor = 'rgba(226, 156, 20, 1)';
  }

  return (
    <FormControlLabel
      {...props}
      control={<ColorSchemeSwitch />}
      label={
        <Typography
          className="body-regular"
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
          }}
        >
          {label}
        </Typography>
      }
      sx={{
        display: 'flex',
        gap: '8px',
        marginLeft: 0,
        '.MuiRadio-root': {
          backgroundColor,
          height: '32px',
          width: '32px',
          '&:hover': { backgroundColor },
        },
        '.MuiSvgIcon-root': {
          width: isSelected ? '24px' : '18px',
          height: isSelected ? '24px' : '18px',
        },
      }}
    />
  );
};
