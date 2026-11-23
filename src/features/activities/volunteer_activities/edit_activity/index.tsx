import { Box, IconButton, Stack } from '@mui/material';
import { IconCheck, IconClose, IconDelete } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { EditActivityProps } from './index.types';
import useEditActivity from './useEditActivity';
import Button from '@components/button';
import DatePicker from '@components/date_picker';
import Dialog from '@components/dialog';
import Divider from '@components/divider';
import SwitchWithLabel from '@components/switch_with_label';
import TextField from '@components/textfield';
import TimePicker from '@components/time_picker';
import Typography from '@components/typography';

const EditActivity = (props: EditActivityProps) => {
  const { t } = useAppTranslation();
  const { desktopUp, tabletUp } = useBreakpoints();

  const {
    hour24,
    localActivity,
    start,
    goal,
    errors,
    deleteOpen,
    handleOpenDelete,
    handleCloseDelete,
    handleChangeName,
    handleChangeDescription,
    handleChangeDate,
    handleChangeTime,
    handleChangeGoal,
    handleToggleAllowExtra,
    handleSave,
    handleDelete,
  } = useEditActivity(props);

  const rowSx = {
    display: 'flex',
    flexDirection: 'row',
    gap: '16px',
    flexWrap: desktopUp ? 'nowrap' : 'wrap',
    '& > *': { flex: desktopUp ? '1' : 'none' },
  };

  return (
    <Box
      sx={{
        border: '1px solid var(--accent-300)',
        borderRadius: 'var(--radius-xl)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        backgroundColor: 'var(--white)',
      }}
    >
      {deleteOpen && (
        <Dialog
          open={deleteOpen}
          onClose={handleCloseDelete}
          title={t('tr_deleteVolunteerActivity')}
          description={t('tr_deleteVolunteerActivityDesc', {
            name: props.data.activity_data.name,
          })}
          actions={
            <Stack spacing="8px" sx={{ width: '100%' }}>
              <Button variant="main" color="red" onClick={handleDelete}>
                {t('tr_delete')}
              </Button>
              <Button variant="secondary" onClick={handleCloseDelete}>
                {t('tr_cancel')}
              </Button>
            </Stack>
          }
        />
      )}

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
        }}
      >
        <Typography className="h2">
          {props.type === 'add'
            ? t('tr_addVolunteerActivity')
            : t('tr_editVolunteerActivity')}
        </Typography>

        {props.type === 'edit' && !tabletUp && (
          <IconButton onClick={handleOpenDelete} color="error">
            <IconDelete color="var(--red-main)" height={20} width={20} />
          </IconButton>
        )}

        {props.type === 'edit' && tabletUp && (
          <Button
            variant="small"
            color="red"
            startIcon={<IconDelete />}
            sx={{ height: '32px', minHeight: '32px !important' }}
            onClick={handleOpenDelete}
          >
            {t('tr_delete')}
          </Button>
        )}
      </Box>

      <TextField
        label={t('tr_title')}
        value={localActivity.activity_data.name}
        onChange={handleChangeName}
        error={errors.name}
        helperText={errors.name && t('tr_fillRequiredField')}
      />

      <TextField
        label={t('tr_description')}
        value={localActivity.activity_data.description}
        onChange={handleChangeDescription}
        multiline
      />

      <Divider color="var(--accent-200)" />

      <Typography className="h4">{t('tr_dateAndTime')}</Typography>

      <Box sx={rowSx}>
        <DatePicker
          label={t('tr_date')}
          value={start}
          onChange={handleChangeDate}
        />
        <TimePicker
          label={t('tr_startTime')}
          value={start}
          onChange={handleChangeTime}
          ampm={!hour24}
          sx={{ minWidth: hour24 ? '140px' : '150px' }}
        />
      </Box>

      <Divider color="var(--accent-200)" />

      <Box sx={rowSx}>
        <TextField
          label={t('tr_participantGoal')}
          type="number"
          value={goal}
          onChange={handleChangeGoal}
          slotProps={{ htmlInput: { min: 1, step: 1, inputMode: 'numeric' } }}
          error={errors.goal.length > 0}
          helperText={errors.goal && t(errors.goal)}
        />
        <SwitchWithLabel
          label={t('tr_allowExtraParticipants')}
          helper={t('tr_allowExtraParticipantsDesc')}
          checked={localActivity.activity_data.allow_extra}
          onChange={handleToggleAllowExtra}
        />
      </Box>

      <Divider color="var(--accent-200)" />

      <Box sx={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
        <Button
          variant="secondary"
          color="red"
          startIcon={<IconClose />}
          onClick={props.onCancel}
        >
          {t('tr_cancel')}
        </Button>
        <Button
          variant="secondary"
          startIcon={<IconCheck />}
          onClick={handleSave}
        >
          {t('tr_done')}
        </Button>
      </Box>
    </Box>
  );
};

export default EditActivity;
