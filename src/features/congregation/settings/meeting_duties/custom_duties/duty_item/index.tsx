import DialogActions from '@components/dialog_actions';
import { Stack } from '@mui/material';
import { IconEdit } from '@components/icons';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { DUTIES_MAX } from '../../shared/constants';
import { DutyItemProps } from './index.types';
import useDutyItem from './useDutyItem';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DutyEdit from '../duty_edit';
import IconButton from '@components/icon_button';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';

const DutyItem = (props: DutyItemProps) => {
  const { t } = useAppTranslation();
  const { isDutiesEditor } = useCurrentUser();

  const {
    formOpen,
    handleCloseForm,
    handleOpenForm,
    deleteOpen,
    handleAskDelete,
    handleCloseDelete,
    handleDelete,
    isBusy,
    handleAmountChange,
  } = useDutyItem(props);

  return (
    <Stack
      sx={{
        minWidth: 0,
        justifyContent: 'space-between',
        gap: 'var(--dialog-gap-mobile)',
      }}
    >
      {formOpen && (
        <DutyEdit
          type="edit"
          id={props.id}
          open={formOpen && !deleteOpen}
          onClose={handleCloseForm}
          onDelete={handleAskDelete}
        />
      )}

      {deleteOpen && (
        <Dialog
          onClose={handleCloseDelete}
          open={deleteOpen}
          title={t('tr_dutiesCustomDelete')}
          description={t('tr_dutiesCustomDeleteDesc')}
          actions={
            <DialogActions>
              <Button
                variant="secondary"
                disabled={isBusy || !isDutiesEditor}
                onClick={handleCloseDelete}
              >
                {t('tr_cancel')}
              </Button>
              <Button
                variant="main"
                color="red"
                disabled={isBusy || !isDutiesEditor}
                onClick={handleDelete}
              >
                {t('tr_delete')}
              </Button>
            </DialogActions>
          }
        />
      )}

      <Stack spacing="4px" direction="row" sx={{ alignItems: 'center' }}>
        <Typography sx={{ minWidth: 0, overflowWrap: 'anywhere' }}>
          {props.name}
        </Typography>

        <IconButton
          aria-label={t('tr_dutyEditNamed', { duty: props.name })}
          disabled={isBusy || !isDutiesEditor}
          onClick={handleOpenForm}
        >
          <IconEdit height={20} width={20} color="var(--accent-main)" />
        </IconButton>
      </Stack>

      <Select
        label={t('tr_dutyPeopleNeeded')}
        inputProps={{
          'aria-label': t('tr_dutyPeopleNeededFor', { duty: props.name }),
        }}
        value={props.amount}
        onChange={handleAmountChange}
        disabled={isBusy || !isDutiesEditor}
      >
        <MenuItem value={0}>
          <Typography>{t('tr_disabledLabel')}</Typography>
        </MenuItem>

        {DUTIES_MAX.map((num) => (
          <MenuItem key={num} value={num}>
            <Typography>{num}</Typography>
          </MenuItem>
        ))}
      </Select>
    </Stack>
  );
};

export default DutyItem;
