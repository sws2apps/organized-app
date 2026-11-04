import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { FullnameOption } from '@definition/settings';
import { NameFormatSelectType } from '@features/congregation/settings/meeting_forms/name_format_select/index.types';
import { buildPersonFullname } from '@utils/common';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';

const NAME_FORMAT_OPTIONS = [
  { value: FullnameOption.FIRST_BEFORE_LAST, label: 'tr_nameFormatFirstLast' },
  { value: FullnameOption.LAST_BEFORE_FIRST, label: 'tr_nameFormatLastFirst' },
  {
    value: FullnameOption.FIRST_MIDDLE_LAST,
    label: 'tr_nameFormatFirstMiddleLast',
  },
  {
    value: FullnameOption.LAST_FIRST_MIDDLE,
    label: 'tr_nameFormatLastFirstMiddle',
  },
  {
    value: FullnameOption.LAST_COMMA_FIRST,
    label: 'tr_nameFormatLastCommaFirst',
  },
  {
    value: FullnameOption.LAST_COMMA_FIRST_MIDDLE,
    label: 'tr_nameFormatLastCommaFirstMiddle',
  },
];

const NameFormatSelect = ({
  label,
  value,
  onChange,
  readOnly,
  inherit,
}: NameFormatSelectType) => {
  const { t } = useAppTranslation();

  const buildSample = (option: FullnameOption) =>
    buildPersonFullname(
      t('tr_nameFormatSampleLastname'),
      t('tr_nameFormatSampleFirstname'),
      option,
      t('tr_nameFormatSampleMiddlename')
    );

  return (
    <Select
      label={label}
      inputProps={{ 'aria-label': label }}
      value={value}
      onChange={(e) => {
        const value = e.target.value;
        if (value === 'inherit' || value === 'display') onChange(value);
        else if (
          NAME_FORMAT_OPTIONS.some((option) => option.value === Number(value))
        )
          onChange(Number(value));
      }}
      readOnly={readOnly}
      renderValue={(selected) => {
        if (selected === 'inherit') {
          return <Typography>{t('tr_nameFormatSameAsApp')}</Typography>;
        }

        if (selected === 'display')
          return <Typography>{t('tr_nameFormatDisplay')}</Typography>;

        const option = NAME_FORMAT_OPTIONS.find(
          (record) => record.value === selected
        );

        return <Typography>{option ? t(option.label) : ''}</Typography>;
      }}
    >
      {inherit && (
        <MenuItem value={'inherit'}>
          <Typography>{t('tr_nameFormatSameAsApp')}</Typography>
        </MenuItem>
      )}

      {inherit && (
        <MenuItem value="display">
          <Typography>{t('tr_nameFormatDisplay')}</Typography>
        </MenuItem>
      )}

      {NAME_FORMAT_OPTIONS.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          sx={{ whiteSpace: 'normal' }}
        >
          <Stack>
            <Typography>{t(option.label)}</Typography>
            <Typography className="body-small-regular" color="var(--grey-400)">
              {buildSample(option.value)}
            </Typography>
          </Stack>
        </MenuItem>
      ))}
    </Select>
  );
};

export default NameFormatSelect;
