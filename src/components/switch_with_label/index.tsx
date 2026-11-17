import { useId } from 'react';
import { Box } from '@mui/material';
import { SwitchWithLabelProps } from './index.types';
import Switch from '@components/switch';
import SwitcherContainer from '@components/switcher_container';
import Typography from '@components/typography';

const SwitchWithLabel = ({
  label,
  helper,
  checked,
  onChange,
  readOnly,
}: SwitchWithLabelProps) => {
  const labelId = useId();
  const helperId = useId();
  return (
    <SwitcherContainer>
      <Switch
        slotProps={{
          input: {
            'aria-labelledby': labelId,
            'aria-describedby': helper ? helperId : undefined,
          },
        }}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        readOnly={readOnly}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Typography
          id={labelId}
          sx={{
            color: 'var(--black)',
          }}
        >
          {label}
        </Typography>
        {helper && (
          <Typography
            id={helperId}
            className="label-small-regular"
            sx={{
              color: 'var(--grey-350)',
            }}
          >
            {helper}
          </Typography>
        )}
      </Box>
    </SwitcherContainer>
  );
};

export default SwitchWithLabel;
