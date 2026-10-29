import { Box, Stack } from '@mui/material';
import { IconDelete } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { getWeekDate } from '@utils/date';
import { circuitOverseerVisitLabel } from '@utils/circuit_overseer_visit';
import { VisitDetailsProps } from './index.types';
import useVisitDetails from './useVisitDetails';
import Button from '@components/button';
import DatePicker from '@components/date_picker';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import SwitchWithLabel from '@components/switch_with_label';
import TextField from '@components/textfield';

const VisitDetails = (props: VisitDetailsProps) => {
  const { t } = useAppTranslation();

  const { tablet600Up } = useBreakpoints();

  const {
    weekOf,
    substitute,
    isDuplicate,
    canSave,
    isProcessing,
    deleteOpen,
    setDeleteOpen,
    handleWeekChange,
    handleSubstituteChange,
    handleSave,
    handleDelete,
  } = useVisitDetails(props);

  const columns = tablet600Up ? 'repeat(2, minmax(0, 1fr))' : 'minmax(0, 1fr)';

  if (deleteOpen && props.visit) {
    return (
      <Dialog
        open
        onClose={() => setDeleteOpen(false)}
        title={t('tr_COVisitDelete')}
        description={t('tr_COVisitDeleteDesc', {
          week: circuitOverseerVisitLabel(props.visit.weekOf),
        })}
        actions={
          <DialogActions>
            <Button
              variant="secondary"
              disabled={isProcessing}
              onClick={() => setDeleteOpen(false)}
            >
              {t('tr_cancel')}
            </Button>
            <Button
              variant="main"
              color="red"
              disabled={isProcessing}
              onClick={handleDelete}
            >
              {t('tr_delete')}
            </Button>
          </DialogActions>
        }
      />
    );
  }

  return (
    <Dialog
      open
      onClose={props.onClose}
      title={t(props.visit ? 'tr_COVisitDetails' : 'tr_addNextVisit')}
      description={t('tr_COVisitDetailsDesc')}
      headerAction={
        props.visit && (
          <Button
            variant="small"
            color="red"
            startIcon={<IconDelete />}
            disableAutoStretch
            onClick={() => setDeleteOpen(true)}
          >
            {t('tr_delete')}
          </Button>
        )
      }
      actions={
        <DialogActions>
          <Button variant="secondary" onClick={props.onClose}>
            {t('tr_cancel')}
          </Button>
          <Button variant="main" disabled={!canSave} onClick={handleSave}>
            {t(props.visit ? 'tr_save' : 'tr_add')}
          </Button>
        </DialogActions>
      }
    >
      <Stack spacing="16px" sx={{ width: '100%' }}>
        <DatePicker
          label={t('tr_COVisitWeek')}
          value={weekOf ? new Date(weekOf) : null}
          minDate={getWeekDate()}
          onChange={handleWeekChange}
          error={isDuplicate}
          helperText={t(
            isDuplicate ? 'tr_dateAlreadyExists' : 'tr_COVisitWeekDesc'
          )}
        />

        <SwitchWithLabel
          label={t('tr_COSubstitute')}
          helper={t('tr_COSubstituteDesc')}
          checked={substitute.enabled}
          onChange={(enabled) => handleSubstituteChange({ enabled })}
        />

        {substitute.enabled && (
          <Box
            sx={{ display: 'grid', gridTemplateColumns: columns, gap: '16px' }}
          >
            <TextField
              label={t('tr_firstname')}
              value={substitute.firstname}
              onChange={(e) =>
                handleSubstituteChange({ firstname: e.target.value })
              }
            />
            <TextField
              label={t('tr_lastname')}
              value={substitute.lastname}
              onChange={(e) =>
                handleSubstituteChange({ lastname: e.target.value })
              }
            />
            <TextField
              label={t('tr_COWifeFirstname')}
              value={substitute.wife_firstname}
              onChange={(e) =>
                handleSubstituteChange({ wife_firstname: e.target.value })
              }
            />
            <TextField
              label={t('tr_COWifeLastname')}
              value={substitute.wife_lastname}
              onChange={(e) =>
                handleSubstituteChange({ wife_lastname: e.target.value })
              }
            />
          </Box>
        )}
      </Stack>
    </Dialog>
  );
};

export default VisitDetails;
