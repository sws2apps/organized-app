import { Stack } from '@mui/material';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { CardSubSectionHeader } from '@features/congregation/settings/shared_styles';
import useSpecialMonths from './useSpecialMonths';
import Checkbox from '@components/checkbox';
import MenuItem from '@components/menuitem';
import Select from '@components/select';

const SpecialMonths = () => {
  const { t } = useAppTranslation();

  const { isServiceCommittee } = useCurrentUser();

  const { yearsList, handleFormatMonths, handleSetMonths } = useSpecialMonths();

  return (
    <Stack spacing="16px" marginTop="-16px !important">
      <CardSubSectionHeader
        title={t('tr_specialMonths')}
        description={t('tr_specialMonthsDesc')}
      />

      <Stack spacing="16px" marginTop="24px !important">
        {yearsList.map((option) => (
          <Select
            key={option.year}
            label={t('tr_serviceYearAlt', { year: option.year })}
            multiple
            value={option.selected}
            renderValue={(values: string[]) => handleFormatMonths(values)}
            onChange={(e) =>
              handleSetMonths(option.year, e.target.value as string[])
            }
            sx={{ flex: 1 }}
            readOnly={!isServiceCommittee}
          >
            {option.months.map((record) => (
              <MenuItem key={record.value} value={record.value}>
                <Checkbox
                  label={record.label}
                  checked={option.selected.includes(record.value)}
                />
              </MenuItem>
            ))}
          </Select>
        ))}
      </Stack>
    </Stack>
  );
};

export default SpecialMonths;
