import { Box, Typography } from '@mui/material';
import { Switch, SwitcherContainer } from '@components/index';
import { handleBoolean } from './utils';

interface SwitchItemProps {
  label: string;
  helper?: string;
  value: boolean;
  setValue: (value: boolean) => void;
}

const SwitchItem = ({ label, helper, value, setValue }: SwitchItemProps) => {
  return (
    <SwitcherContainer>
      <Switch checked={value} onChange={(e) => handleBoolean(e, setValue)} />
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

export default SwitchItem;
