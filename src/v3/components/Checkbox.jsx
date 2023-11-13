import PropTypes from 'prop-types';
import { Checkbox } from '@mui/material';
import { IconCheckboxEmpty, IconCheckboxFilled, IconCheckboxMultiple } from '@icons';

const CPECheckbox = ({ checked = false, indeterminate = false, disabled = false, onChange }) => {
  return (
    <Checkbox
      disableRipple
      checked={checked}
      indeterminate={indeterminate}
      disabled={disabled}
      onChange={onChange ? onChange : null}
      sx={{
        padding: '4px',
        '&.Mui-disabled': {
          color: 'var(--accent-300)',
        },
      }}
      icon={<IconCheckboxEmpty color={disabled ? 'var(--accent-300)' : 'var(--accent-350)'} />}
      indeterminateIcon={<IconCheckboxMultiple color={disabled ? 'var(--accent-300)' : 'var(--accent-main)'} />}
      checkedIcon={<IconCheckboxFilled color={disabled ? 'var(--accent-300)' : 'var(--accent-main)'} />}
    />
  );
};

CPECheckbox.propTypes = {
  checked: PropTypes.bool,
  indeterminate: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default CPECheckbox;
