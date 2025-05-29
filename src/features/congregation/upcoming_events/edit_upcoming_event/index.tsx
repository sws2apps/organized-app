import { Box } from '@mui/material';
import { EditUpcomingEventProps } from './index.types';
import Typography from '@components/typography';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import DatePicker from '@components/date_picker';
import TimePicker from '@components/time_picker';
import Select from '@components/select';
import MenuItem from '@components/menuitem';
import { cloneElement } from 'react';
import TextField from '@components/textfield';
import Button from '@components/button';
import { IconCheck, IconClose, IconDelete } from '@components/icons';
import Divider from '@components/divider';
import { decorationsForEvent } from '../decorations_for_event';
import {
  UpcomingEventCategory,
  UpcomingEventDuration,
} from '@definition/upcoming_events';
import useEditUpcomingEvent from './useEditUpcomingEvent';

const EditUpcomingEvent = (props: EditUpcomingEventProps) => {
  const { t } = useAppTranslation();
  const { desktopUp } = useBreakpoints();

  const {
    hour24,
    localEvent,
    handleChangeEventType,
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
      <Typography className="h2" color="var(--black)">
        {props.type == 'add'
          ? t('tr_addUpcomingEvent')
          : t('tr_editUpcomingEvent')}
      </Typography>
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

            '& > *': {
              flex: !desktopUp ? 'none' : '1',
            },
          }}
        >
          <Select
            label={t('tr_eventType')}
            value={localEvent.event_data.type}
            onChange={handleChangeEventType}
          >
            {decorationsForEvent.map((option, index) => {
              const isSelected = localEvent.event_data.type === index;

              return (
                <MenuItem value={index} key={option.translationKey}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      gap: '8px',
                      alignItems: 'center',
                    }}
                  >
                    {cloneElement(option.icon, {
                      color: isSelected ? 'var(--accent-main)' : 'var(--black)',
                    })}
                    <Typography
                      className="body-regular"
                      color={isSelected ? 'var(--accent-main)' : 'var(--black)'}
                    >
                      {t(option.translationKey)}
                    </Typography>
                  </Box>
                </MenuItem>
              );
            })}
          </Select>
          {localEvent.event_data.type === UpcomingEventCategory.Custom && (
            <TextField
              label={t('tr_eventTitle')}
              value={localEvent.event_data.custom}
              onChange={handleChangeEventCustomTitle}
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
            value={localEvent.event_data.duration}
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
                sx={{ minWidth: '140px' }}
                value={new Date(localEvent.event_data.start)}
              />
              <TimePicker
                onChange={handleChangeEventEndTime}
                label={t('tr_endTime')}
                ampm={!hour24}
                sx={{ minWidth: '140px' }}
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
          startIcon={props.type === 'add' ? <IconClose /> : <IconDelete />}
          onClick={props.type === 'add' ? props.onCancel : handleDeleteEvent}
        >
          {props.type === 'add' ? t('tr_cancel') : t('tr_delete')}
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
