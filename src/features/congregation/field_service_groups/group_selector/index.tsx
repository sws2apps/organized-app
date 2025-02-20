import { InputAdornment, SelectChangeEvent } from '@mui/material';
import { IconClose, IconGroups } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { GroupSelectorProps } from './index.types';
import useGroupSelector from './useGroupSelector';
import Select from '@components/select';
import MenuItem from '@components/menuitem';
import Typography from '@components/typography';
import IconButton from '@components/icon_button';

const GroupSelector = ({ value = '', onChange }: GroupSelectorProps) => {
  const { t } = useAppTranslation();

  const { options, renderValue, isHovered, setIsHovered } = useGroupSelector();

  return (
    <Select
      fullWidth
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      label={t('tr_fieldServiceGroup')}
      value={value}
      onChange={(e: SelectChangeEvent<string>) => {
        onChange?.(e.target.value);
        setIsHovered(false);
      }}
      renderValue={(value: string) => renderValue(value)}
      startAdornment={
        <InputAdornment position="start">
          <IconGroups color="var(--black)" />
        </InputAdornment>
      }
      endAdornment={
        isHovered &&
        value.length > 0 && (
          <InputAdornment position="end">
            <IconButton
              sx={{ padding: 0, marginLeft: '-40px' }}
              onClick={() => {
                onChange?.('');
                setIsHovered(false);
              }}
            >
              <IconClose color="var(--black)" />
            </IconButton>
          </InputAdornment>
        )
      }
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value} sx={{ gap: '8px' }}>
          <IconGroups color="var(--black)" />
          <Typography>{option.label}</Typography>
        </MenuItem>
      ))}
    </Select>
  );
};

export default GroupSelector;
