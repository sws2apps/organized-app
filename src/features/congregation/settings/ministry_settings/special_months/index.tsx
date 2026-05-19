import { Stack } from '@mui/material';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useSpecialMonths from './useSpecialMonths';
import Checkbox from '@components/checkbox';
import MenuItem from '@components/menuitem';
import Select from '@components/select';

const SpecialMonths = () => {
  const { t } = useAppTranslation();

  const { isServiceCommittee } = useCurrentUser();

  const { yearsList, handleFormatMonths, handleSetMonths, currentYear } =
    useSpecialMonths();

  return (
    <Stack spacing="16px">
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
          readOnly={!isServiceCommittee || option.year < currentYear}
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
  );
};

export default SpecialMonths;
