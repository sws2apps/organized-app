import { useAtomValue } from 'jotai';
import { userDataViewState } from '@states/settings';
import { Box, Stack } from '@mui/material';
import { IconAdd } from '@components/icons';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import useCustomDuties from './useCustomDuties';
import Button from '@components/button';
import DutyEdit from './duty_edit';
import DutyItem from './duty_item';

const CustomDuties = () => {
  const dataView = useAtomValue(userDataViewState);
  const { t } = useAppTranslation();
  const { isDutiesEditor } = useCurrentUser();
  const { mobile400Down } = useBreakpoints();

  const { formOpen, handleCloseForm, handleOpenForm, customDuties } =
    useCustomDuties();

  return (
    <Stack spacing="8px">
      {formOpen && (
        <DutyEdit
          key={dataView}
          type="add"
          open={formOpen}
          onClose={handleCloseForm}
        />
      )}

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: mobile400Down
            ? 'minmax(0, 1fr)'
            : 'repeat(2, minmax(0, 1fr))',
          gap: 'var(--dialog-gap) var(--dialog-gap-mobile)',
        }}
      >
        {customDuties.map((duty) => (
          <DutyItem key={`${dataView}:${duty.id}`} {...duty} />
        ))}
      </Box>

      <Button
        variant="small"
        disableAutoStretch
        disabled={!isDutiesEditor}
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
