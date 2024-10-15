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
  return (
    <SwitcherContainer>
      <Switch
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        readOnly={readOnly}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Typography color="var(--black)">{label}</Typography>
        {helper && (
          <Typography className="label-small-regular" color="var(--grey-350)">
            {helper}
          </Typography>
        )}
      </Box>
    </SwitcherContainer>
  );
};

export default SwitchWithLabel;
