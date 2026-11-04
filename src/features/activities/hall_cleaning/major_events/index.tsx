import { Box, Stack, FormControlLabel } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { addDays, formatDate } from '@utils/date';
import { CLEANING_NAME_WIDTH } from '@features/activities/hall_cleaning/row_layout';
import { IconAdd, IconDelete } from '@components/icons';
import type { CleaningActivity } from '@definition/hall_cleaning';
import { cleaningActivityLabelKey } from '@utils/major_cleaning';
import Select from '@components/select';
import MenuItem from '@components/menuitem';
import Button from '@components/button';
import AutoComplete from '@components/autocomplete';
import DatePicker from '@components/date_picker';
import Divider from '@components/divider';
import IconButton from '@components/icon_button';
import InfoNote from '@components/info_note';
import Switch from '@components/switch';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import useMajorEvents from '@features/activities/hall_cleaning/major_events/useMajorEvents';

export default function MajorEvents({ week }: Readonly<{ week: string }>) {
  const { t } = useAppTranslation();
  const { laptopDown } = useBreakpoints();
  const {
    responsibleOptions,
    scheduledActivities,
    selectActivity,
    extras,
    multiple,
    toggleMultiple,
    addCongregation,
    changeCongregation,
    removeCongregation,
    date,
    setDate,
    event,
    add,
    update,
    remove,
    busy,
    error,
    retry,
  } = useMajorEvents(week);
  return (
    <Stack spacing={2}>
      <Divider color="var(--accent-200)" />
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Typography className="h4" sx={{ flex: 1, minWidth: 0 }}>
          {t('tr_cleaningSpecialActivities')}
        </Typography>
        <Button
          variant="small"
          color="red"
          startIcon={<IconDelete color="var(--red-main)" />}
          disableAutoStretch
          disabled={!event || busy}
          onClick={remove}
          sx={{ visibility: event ? 'visible' : 'hidden', flexShrink: 0 }}
        >
          {t('tr_delete')}
        </Button>
      </Stack>
      {scheduledActivities.length > 1 && (
        <Select
          label={t('tr_scheduledActivities')}
          inputProps={{ 'aria-label': t('tr_scheduledActivities') }}
          value={date}
          disabled={busy}
          onChange={(e) => selectActivity(e.target.value as string)}
        >
          {scheduledActivities.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              <Typography>{item.label}</Typography>
            </MenuItem>
          ))}
        </Select>
      )}
      {!event && (
        <Stack spacing={2}>
          <InfoNote message={t('tr_cleaningActivityEmpty')} />
          <Button
            variant="small"
            startIcon={<IconAdd />}
            disableAutoStretch
            disabled={busy}
            onClick={add}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('tr_add')}
          </Button>
        </Stack>
      )}
      {event && (
        <>
          <Select
            label={t('tr_cleaningActivity')}
            inputProps={{ 'aria-label': t('tr_cleaningActivity') }}
            value={event.activity ?? 'major_cleaning'}
            onChange={(e) =>
              update({ activity: e.target.value as CleaningActivity })
            }
          >
            {(
              [
                'major_cleaning',
                'grounds_care',
                'cleaning_and_grounds',
              ] as const
            ).map((activity) => (
              <MenuItem key={activity} value={activity}>
                <Typography>{t(cleaningActivityLabelKey(activity))}</Typography>
              </MenuItem>
            ))}
          </Select>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: laptopDown
                ? 'minmax(0, 1fr)'
                : `${CLEANING_NAME_WIDTH}px minmax(0, 1fr)`,
              columnGap: '8px',
              rowGap: '16px',
              alignItems: 'start',
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <DatePicker
                label={t('tr_date')}
                readOnly={busy}
                value={new Date(date)}
                minDate={new Date(week)}
                maxDate={addDays(new Date(week), 6)}
                onChange={(value) => {
                  if (value && Number.isFinite(value.getTime())) {
                    const selected = formatDate(value, 'yyyy/MM/dd');
                    if (
                      selected >= week &&
                      selected <=
                        formatDate(addDays(new Date(week), 6), 'yyyy/MM/dd')
                    )
                      setDate(selected);
                  }
                }}
              />
            </Box>
            <AutoComplete<string>
              height={44}
              sx={{ minWidth: 0 }}
              label={t('tr_responsible')}
              options={responsibleOptions}
              freeSolo
              forcePopupIcon
              showInputClearButton
              value={event.coordinator || null}
              inputValue={event.coordinator}
              onInputChange={(_, value, reason) => {
                if (reason === 'input') update({ coordinator: value });
              }}
              onChange={(_, value) => {
                const coordinator = typeof value === 'string' ? value : '';
                if (coordinator !== event.coordinator) update({ coordinator });
              }}
            />
          </Box>
          <Stack spacing={2}>
            <FormControlLabel
              sx={{
                margin: 0,
                gap: 1,
                alignSelf: 'flex-start',
                alignItems: 'center',
              }}
              control={
                <Switch
                  checked={multiple}
                  onChange={(_, checked) => toggleMultiple(checked)}
                />
              }
              label={<Typography>{t('tr_majorMultiple')}</Typography>}
            />
            {multiple && (
              <Stack spacing="16px">
                {extras.map((participant, index) => (
                  <Stack
                    key={participant.id}
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: 'center' }}
                  >
                    <TextField
                      sx={{ flex: 1, minWidth: 0 }}
                      label={t('tr_majorAddCongregation')}
                      slotProps={{
                        htmlInput: {
                          'aria-label': t('tr_majorCongregationNumber', {
                            number: index + 1,
                          }),
                        },
                      }}
                      value={participant.name}
                      onChange={(e) =>
                        changeCongregation(participant.id, e.target.value)
                      }
                    />
                    <IconButton
                      edge={false}
                      aria-label={t('tr_majorDeleteCongregation', {
                        number: index + 1,
                      })}
                      onClick={() => removeCongregation(participant.id)}
                      sx={{
                        width: '44px',
                        height: '44px',
                        flexShrink: 0,
                        margin: 0,
                        borderRadius: 'var(--radius-l)',
                      }}
                    >
                      <IconDelete color="var(--red-main)" />
                    </IconButton>
                  </Stack>
                ))}
                <Button
                  variant="small"
                  startIcon={<IconAdd />}
                  disableAutoStretch
                  onClick={addCongregation}
                  sx={{ alignSelf: 'flex-end' }}
                >
                  {t('tr_add')}
                </Button>
              </Stack>
            )}
          </Stack>
        </>
      )}
      {error && (
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <Typography role="alert" color="var(--red-main)">
            {error}
          </Typography>
          <Button variant="small" onClick={retry}>
            {t('tr_majorRetry')}
          </Button>
        </Stack>
      )}
    </Stack>
  );
}
