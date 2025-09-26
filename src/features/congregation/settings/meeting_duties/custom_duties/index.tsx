import { Stack } from '@mui/material';
import { IconAdd } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useCustomDuties from './useCustomDuties';
import Button from '@components/button';
import DutyEdit from './duty_edit';
import DutyItem from './duty_item';

const CustomDuties = () => {
  const { t } = useAppTranslation();

  const { formOpen, handleCloseForm, handleOpenForm, customDuties } =
    useCustomDuties();

  return (
    <Stack spacing="8px">
      {formOpen && (
        <DutyEdit type="add" open={formOpen} onClose={handleCloseForm} />
      )}

      <Stack spacing="16px">
        {customDuties.map((duty) => (
          <DutyItem key={duty.id} {...duty} />
        ))}
      </Stack>

      <Button
        variant="small"
        onClick={handleOpenForm}
        startIcon={<IconAdd />}
        sx={{
          height: '32px',
          minHeight: '32px !important',
          alignSelf: 'flex-start',
        }}
      >
        {t('tr_add')}
      </Button>
    </Stack>
  );
};

export default CustomDuties;
