import PropTypes from 'prop-types';
import { Checkbox, FormControlLabel } from '@mui/material';
import { IconCheckboxEmpty, IconCheckboxFilled, IconCheckboxMultiple } from '@icons';
import { Typography } from '@components';
import { useRef } from 'react';

const CPECheckbox = ({ checked = false, indeterminate = false, disabled = false, onChange, label = '' }) => {
  const checkBoxRef = useRef();

  return (
    <FormControlLabel
      sx={{ marginLeft: '-4px', display: 'flex', alignItems: 'center', gap: '8px' }}
      control={
        <Checkbox
          ref={checkBoxRef}
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
        <Typography
          variant="body-regular"
          color="var(--black)"
          sx={{ cursor: 'pointer' }}
          onClick={() => checkBoxRef.current.click()}
        >
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
