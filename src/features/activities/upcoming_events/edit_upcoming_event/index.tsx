import { cloneElement } from 'react';
import { Box } from '@mui/material';
import { IconCheck, IconClose, IconDelete } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import {
  UpcomingEventCategory,
  UpcomingEventDuration,
} from '@definition/upcoming_events';
import { decorationsForEvent } from '../decorations_for_event';
import { EditUpcomingEventProps } from './index.types';
import useEditUpcomingEvent from './useEditUpcomingEvent';
import Button from '@components/button';
import DatePicker from '@components/date_picker';
import Divider from '@components/divider';
import IconButton from '@components/icon_button';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import TextField from '@components/textfield';
import TimePicker from '@components/time_picker';
import Typography from '@components/typography';

const EditUpcomingEvent = (props: EditUpcomingEventProps) => {
  const { t } = useAppTranslation();

  const { desktopUp, tabletUp } = useBreakpoints();

  const {
    hour24,
    localEvent,
    errors,
    handleChangeEventCategory,
    handleChangeEventCustomTitle,
    handleChangeEventDescription,
    handleSaveEvent,
    handleDeleteEvent,
    handleChangeEventDuration,
    handleChangeEventStartDate,
    handleChangeEventStartTime,
    handleChangeEventEndDate,
    handleChangeEventEndTime,
  } = useEditUpcomingEvent(props);

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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: tabletUp ? 'space-between' : 'unset',
          gap: '16px',
        }}
      >
        <Typography className="h2" color="var(--black)">
          {props.type == 'add'
            ? t('tr_addUpcomingEvent')
            : t('tr_editUpcomingEvent')}
        </Typography>

        {props.type === 'edit' && !tabletUp && (
          <IconButton onClick={handleDeleteEvent} color="error">
            <IconDelete color="var(--red-main)" height={20} width={20} />
          </IconButton>
        )}

        {props.type === 'edit' && tabletUp && (
          <Button
            variant="small"
            color="red"
            startIcon={<IconDelete />}
            sx={{
              height: '32px',
              minHeight: '32px !important',
            }}
            onClick={handleDeleteEvent}
          >
            {t('tr_delete')}
          </Button>
        )}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '16px',
            flexWrap: !desktopUp ? 'wrap' : 'nowrap',
            '& > *': { flex: !desktopUp ? 'none' : '1' },
          }}
        >
          <Select
            label={t('tr_eventType')}
            value={localEvent.event_data.category ?? ''}
            onChange={handleChangeEventCategory}
            error={errors.category}
            helperText={errors.category && t('tr_fillRequiredField')}
          >
            {decorationsForEvent.map((option, index) => (
              <MenuItem value={index} key={option.translationKey}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '8px',
                    alignItems: 'center',
                  }}
                >
                  {cloneElement(option.icon, { color: 'var(--black)' })}
                  <Typography className="body-regular" color="var(--black)">
                    {t(option.translationKey)}
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>

          {localEvent.event_data.category === UpcomingEventCategory.Custom && (
            <TextField
              label={t('tr_eventTitle')}
              value={localEvent.event_data.custom}
              onChange={handleChangeEventCustomTitle}
              error={errors.custom}
              helperText={errors.custom && t('tr_fillRequiredField')}
            />
          )}

          <TextField
            label={t('tr_eventDescription')}
            value={localEvent.event_data.description}
            onChange={handleChangeEventDescription}
          />
        </Box>

        <Divider color="var(--accent-200)" />

        <Typography className="h4">{t('tr_dateAndTime')}</Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: '16px',

            flexWrap: !desktopUp ? 'wrap' : 'nowrap',
          }}
        >
          <Select
            label={t('tr_eventDuration')}
            onChange={handleChangeEventDuration}
            value={localEvent.event_data.duration ?? ''}
            error={errors.duration}
            helperText={errors.duration && t('tr_fillRequiredField')}
          >
            <MenuItem value={UpcomingEventDuration.SingleDay} key={0}>
              <Typography className="body-regular" color="var(--black)">
                {t('tr_singleDay')}
              </Typography>
            </MenuItem>
            <MenuItem value={UpcomingEventDuration.MultipleDays} key={1}>
              <Typography className="body-regular" color="var(--black)">
                {t('tr_multipleDays')}
              </Typography>
            </MenuItem>
          </Select>

          {localEvent.event_data.duration ===
          UpcomingEventDuration.SingleDay ? (
            <>
              <DatePicker
                label={t('tr_date')}
                onChange={handleChangeEventStartDate}
                value={new Date(localEvent.event_data.start)}
              />
              <TimePicker
                onChange={handleChangeEventStartTime}
                label={t('tr_startTime')}
                ampm={!hour24}
                sx={{ minWidth: hour24 ? '140px' : '150px' }}
                value={new Date(localEvent.event_data.start)}
              />
              <TimePicker
                onChange={handleChangeEventEndTime}
                label={t('tr_endTime')}
                ampm={!hour24}
                sx={{ minWidth: hour24 ? '140px' : '150px' }}
                value={new Date(localEvent.event_data.end)}
              />
            </>
          ) : (
            <>
              <DatePicker
                label={t('tr_startDate')}
                onChange={handleChangeEventStartDate}
                value={new Date(localEvent.event_data.start)}
              />
              <DatePicker
                label={t('tr_endDate')}
                onChange={handleChangeEventEndDate}
                value={new Date(localEvent.event_data.end)}
              />
            </>
          )}
        </Box>
        <Divider color="var(--accent-200)" />
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          justifyContent: 'flex-end',
        }}
      >
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
          onClick={handleSaveEvent}
        >
          {t('tr_done')}
        </Button>
      </Box>
    </Box>
  );
};

export default EditUpcomingEvent;
