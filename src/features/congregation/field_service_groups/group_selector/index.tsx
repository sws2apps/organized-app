import { SelectChangeEvent } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { GroupSelectorProps } from './index.types';
import useGroupSelector from './useGroupSelector';
import Select from '@components/select';
import MenuItem from '@components/menuitem';
import Typography from '@components/typography';

const GroupSelector = ({ value = '', onChange }: GroupSelectorProps) => {
  const { t } = useAppTranslation();

  const { options } = useGroupSelector();

  return (
    <Select
      sx={{ width: '100%', flex: 1 }}
      label={t('tr_assignedGroupAuxClassroom')}
      value={value}
      onChange={(e: SelectChangeEvent<string>) => {
        onChange?.(e.target.value);
      }}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          <Typography>{option.label}</Typography>
        </MenuItem>
      ))}
    </Select>
  );
};

export default GroupSelector;
