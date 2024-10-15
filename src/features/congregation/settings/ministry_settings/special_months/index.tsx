import { Stack } from '@mui/material';
import { IconAdd } from '@components/icons';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { CardSubSectionHeader } from '@features/congregation/settings/shared_styles';
import useSpecialMonths from './useSpecialMonths';
import Button from '@components/button';
import MonthsRecord from './months_record';

const SpecialMonths = () => {
  const { t } = useAppTranslation();

  const { isServiceCommittee } = useCurrentUser();

  const { months, handleAddRecord, handleDelete } = useSpecialMonths();

  return (
    <Stack spacing="16px" marginTop="-16px !important">
      <CardSubSectionHeader
        title={t('tr_specialMonths')}
        description={t('tr_specialMonthsDesc')}
      />

      {months.length > 0 && (
        <Stack spacing="16px" marginTop="16px">
          {months.map((month, index) => (
            <MonthsRecord
              key={month.id}
              month={month}
              isLast={index === months.length - 1}
              onAdd={handleAddRecord}
              onDelete={handleDelete}
            />
          ))}
        </Stack>
      )}

      {isServiceCommittee && months.length === 0 && (
        <Button
          variant="small"
          startIcon={<IconAdd />}
          sx={{
            height: '32px',
            minHeight: '32px !important',
            alignSelf: 'self-start',
          }}
          onClick={handleAddRecord}
        >
          {t('tr_add')}
        </Button>
      )}
    </Stack>
  );
};

export default SpecialMonths;
