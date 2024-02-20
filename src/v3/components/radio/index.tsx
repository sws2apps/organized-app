import { ChangeEvent } from 'react';
import { Radio } from '@mui/material';
import { IconRadioButtonChecked, IconRadioButtonUnchecked } from '@icons/index';

const CPERadio = ({
  checked = false,
  disabled = false,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange?: (e: ChangeEvent<HTMLInputElement>, checked: boolean) => void;
}) => {
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

export default CPERadio;
