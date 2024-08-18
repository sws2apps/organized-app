import { Checkbox as MUICheckbox, FormControlLabel } from '@mui/material';
import Typography from '@components/typography';
import {
  IconCheckboxEmpty,
  IconCheckboxFilled,
  IconCheckboxMultiple,
} from '@icons/index';
import { CheckboxPropsType } from './index.types';
import {
  StyleCheckboxBorder,
  StyleCheckboxBorderChecked,
} from '@components/checkbox/index.style';

/**
 * Custom checkbox component.
 * @param {CheckboxPropsType} props - Props for the CustomCheckbox component.
 * @returns {JSX.Element} CustomCheckbox component.
 */
const Checkbox = (props: CheckboxPropsType) => {
  const checked = props.checked || false;
  const indeterminate = props.indeterminate || false;
  const disabled = props.disabled || false;
  const label = props.label || '';
  const labelDescription = props.labelDescription || '';
  const isBorder = props.isBorder || false;
  const className = props.className || 'body-regular';
  const sx = props.sx;

  return (
    <FormControlLabel
      sx={{
        padding: '4px 0px',
        marginLeft: '-4px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        opacity: disabled ? '24%' : 1,
        width: 'fit-content',
        ...(isBorder && { ...StyleCheckboxBorder }),
        ...(isBorder && checked && { ...StyleCheckboxBorderChecked }),
        ...sx,
      }}
      control={
        <MUICheckbox
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
          icon={
            <IconCheckboxEmpty
              color={disabled ? 'var(--accent-300)' : 'var(--accent-350)'}
            />
          }
          indeterminateIcon={
            <IconCheckboxMultiple
              color={disabled ? 'var(--accent-300)' : 'var(--accent-main)'}
            />
          }
          checkedIcon={
            <IconCheckboxFilled
              color={disabled ? 'var(--accent-300)' : 'var(--accent-main)'}
            />
          }
        />
      }
      label={
        <>
          <Typography className={className} color="var(--black)">
            {label}
          </Typography>
          {labelDescription != '' ? (
            <Typography
              className="body-small-regular"
              color={'var(--grey-400)'}
            >
              {labelDescription}
            </Typography>
          ) : null}
        </>
      }
    />
  );
};

export default Checkbox;
