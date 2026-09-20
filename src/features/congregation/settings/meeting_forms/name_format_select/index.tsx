import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { FullnameOption } from '@definition/settings';
import { NAME_FORMAT_INHERIT, NameFormatSelectType } from './index.types';
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
      value={value}
      onChange={(e) => onChange(+e.target.value)}
      readOnly={readOnly}
      renderValue={(selected) => {
        if (selected === NAME_FORMAT_INHERIT) {
          return <Typography>{t('tr_nameFormatSameAsApp')}</Typography>;
        }

        const option = NAME_FORMAT_OPTIONS.find(
          (record) => record.value === selected
        );

        return <Typography>{option ? t(option.label) : ''}</Typography>;
      }}
    >
      {inherit && (
        <MenuItem value={NAME_FORMAT_INHERIT}>
          <Typography>{t('tr_nameFormatSameAsApp')}</Typography>
        </MenuItem>
      )}

      {NAME_FORMAT_OPTIONS.map((option) => (
        <MenuItem
          key={option.value}
          value={option.value}
          sx={{ minHeight: '56px' }}
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
