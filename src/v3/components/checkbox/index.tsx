import { Checkbox, FormControlLabel } from '@mui/material';
import Typography from '@components/typography';
import { IconCheckboxEmpty, IconCheckboxFilled, IconCheckboxMultiple } from '@icons/index';
import { CheckboxPropsType } from './index.types';
import { StyleCheckboxBorder, StyleCheckboxBorderChecked } from '@components/checkbox/index.style';

const CustomCheckbox = (props: CheckboxPropsType) => {
  const checked = props.checked || false;
  const indeterminate = props.indeterminate || false;
  const disabled = props.disabled || false;
  const label = props.label || '';
  const isBorder = props.isBorder || false;
  const className = props.className || 'body-regular';

  return (
    <FormControlLabel
      sx={{
        marginLeft: '-4px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        ...(isBorder && { ...StyleCheckboxBorder }),
        ...(isBorder && checked && { ...StyleCheckboxBorderChecked }),
      }}
      control={
        <Checkbox
          checked={checked}
          indeterminate={indeterminate}
          disabled={disabled}
          onChange={props.onChange ? props.onChange : null}
          sx={{
            padding: 0,
            '&.Mui-disabled': {
              color: 'var(--accent-300)',
            },
          }}
          icon={<IconCheckboxEmpty color={disabled ? 'var(--accent-300)' : 'var(--accent-350)'} />}
          indeterminateIcon={<IconCheckboxMultiple color={disabled ? 'var(--accent-300)' : 'var(--accent-main)'} />}
          checkedIcon={<IconCheckboxFilled color={disabled ? 'var(--accent-300)' : 'var(--accent-main)'} />}
        />
      }
      label={
        <Typography className={className} color="var(--black)">
          {label}
        </Typography>
      }
    />
  );
};

export default CustomCheckbox;
