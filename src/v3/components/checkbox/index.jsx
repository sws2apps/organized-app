import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel } from '@mui/material';
import { Typography } from '@components';
import { IconCheckboxEmpty, IconCheckboxFilled, IconCheckboxMultiple } from '@icons';

const CPECheckbox = ({ checked = false, indeterminate = false, disabled = false, onChange, label = '' }) => {
  return (
    <FormControlLabel
      sx={{ marginLeft: '-4px', display: 'flex', alignItems: 'center', gap: '8px' }}
      control={
        <Checkbox
          checked={checked}
          indeterminate={indeterminate}
          disabled={disabled}
          onChange={onChange ? onChange : null}
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
        <Typography variant="body-regular" color="var(--black)">
          {label}
        </Typography>
      }
    />
  );
};

CPECheckbox.propTypes = {
  checked: PropTypes.bool,
  indeterminate: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
};

export default CPECheckbox;
