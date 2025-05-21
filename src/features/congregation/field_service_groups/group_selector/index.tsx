import { useNavigate } from 'react-router';
import { SelectChangeEvent } from '@mui/material';
import { IconArrowLink } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { GroupSelectorProps } from './index.types';
import useGroupSelector from './useGroupSelector';
import Select from '@components/select';
import MenuItem from '@components/menuitem';
import Typography from '@components/typography';

const GroupSelector = ({
  value = '',
  onChange,
  label,
  showEdit,
  helperText,
  includeLanguageGroup = false,
  showServiceGroups = true,
  readOnly = false,
}: GroupSelectorProps) => {
  const navigate = useNavigate();

  const { t } = useAppTranslation();

  const { options } = useGroupSelector(showServiceGroups, includeLanguageGroup);

  return (
    <Select
      readOnly={readOnly}
      slotProps={{ root: { className: 'service-group-selector' } }}
      sx={{ width: '100%', flex: 1 }}
      label={label || t('tr_fieldServiceGroup')}
      value={value}
      onChange={(e: SelectChangeEvent<string>) => {
        if (!e.target.value) {
          e.preventDefault();
          e.stopPropagation();
          navigate('/field-service-groups');
          return;
        }

        onChange?.(e.target.value);
      }}
      helperText={showServiceGroups && helperText}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          <Typography>{option.label}</Typography>
        </MenuItem>
      ))}

      {showEdit && (
        <MenuItem
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography color="var(--accent-dark)">
            {t('tr_serviceGroupsQuickEdit')}
          </Typography>
          <IconArrowLink color="var(--accent-main)" />
        </MenuItem>
      )}
    </Select>
  );
};

export default GroupSelector;
