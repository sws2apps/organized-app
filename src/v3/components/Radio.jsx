import PropTypes from 'prop-types';
import { Radio } from '@mui/material';
import { IconRadioButtonChecked, IconRadioButtonUnchecked } from '@icons';

const CPERadio = ({ checked = false, disabled = false, onChange }) => {
  return (
    <Radio
      checked={checked}
      disabled={disabled}
      onChange={onChange ? onChange : null}
      sx={{
        padding: '4px',
        '&.Mui-disabled': {
          color: 'var(--accent-300)',
        },
      }}
      icon={<IconRadioButtonUnchecked color={disabled ? 'var(--accent-300)' : 'var(--accent-350)'} />}
      checkedIcon={<IconRadioButtonChecked color={disabled ? 'var(--accent-300)' : 'var(--accent-main)'} />}
    />
  );
};

CPERadio.propTypes = {
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
};

export default CPERadio;
