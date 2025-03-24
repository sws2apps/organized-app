import { Box } from '@mui/material';
import { EditUpcomingEventProps } from './index.types';
import Typography from '@components/typography';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import DatePicker from '@components/date_picker';
import TimePicker from '@components/time_picker';
import Select from '@components/select';
import MenuItem from '@components/menuitem';
import { cloneElement, Fragment } from 'react';
import TextField from '@components/textfield';
import Button from '@components/button';
import { IconAdd, IconCheck, IconClose, IconDelete } from '@components/icons';
import Divider from '@components/divider';
import useEditUpcomingEvent from './useEditUpcomingEvent';
import { decorationsForEvent } from '../decorations_for_event';
import { UpcomingEventCategory } from '@definition/upcoming_events';

const EditUpcomingEvent = (props: EditUpcomingEventProps) => {
  const { t } = useAppTranslation();
  const { tablet600Down } = useBreakpoints();

  const {
    localEvents,
    handleDeleteEvent,
    handleAddNewEvent,
    handleSaveChanges,
    handleChangeEventType,
    handleChangeEventTime,
    handleChangeEventDate,
    handleChangeEventCustom,
    handleChangeEventAdditionalInfo,
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
        {localEvents.map(
          (event, eventIndex) =>
            event._deleted.value === false && (
              <Fragment key={eventIndex}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',

                    gap: '16px',
                    flexWrap: tablet600Down ? 'wrap' : 'nowrap',

                    '& > *': {
                      flex: tablet600Down ? 'none' : '1',
                    },
                  }}
                >
                  <DatePicker
                    view="input"
                    label={t('tr_date')}
                    value={event.date.value}
                    onChange={(date) => handleChangeEventDate(eventIndex, date)}
                  />
                  <TimePicker
                    ampm
                    label={t('tr_timerLabelTime')}
                    value={event.time.value}
                    onChange={(time) => handleChangeEventTime(eventIndex, time)}
                  />
                  <Select
                    label={t('tr_eventType')}
                    value={event.type.value}
                    onChange={(e) =>
                      handleChangeEventType(
                        eventIndex,
                        e.target.value as number
                      )
                    }
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
                          <Typography
                            className="body-regular"
                            color="var(--black)"
                          >
                            {t(option.translationKey)}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '16px',
                  }}
                >
                  {event.type.value === UpcomingEventCategory.Custom && (
                    <TextField
                      label={t('tr_customName')}
                      value={event.custom.value}
                      onChange={(e) =>
                        handleChangeEventCustom(eventIndex, e.target.value)
                      }
                    />
                  )}
                  <TextField
                    label={t('tr_additionalInfo')}
                    value={event.additional.value}
                    onChange={(e) =>
                      handleChangeEventAdditionalInfo(
                        eventIndex,
                        e.target.value
                      )
                    }
                  />
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: '16px',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button
                    variant="small"
                    color="red"
                    startIcon={<IconDelete />}
                    disableAutoStretch
                    sx={{ minHeight: '32px', height: '32px' }}
                    onClick={() => handleDeleteEvent(eventIndex)}
                  >
                    {t('tr_delete')}
                  </Button>
                  {eventIndex === localEvents.length - 1 && (
                    <Button
                      variant="small"
                      startIcon={<IconAdd />}
                      disableAutoStretch
                      sx={{ minHeight: '32px', height: '32px' }}
                      onClick={handleAddNewEvent}
                    >
                      {t('tr_add')}
                    </Button>
                  )}
                </Box>
                <Divider color="var(--accent-200)" />
              </Fragment>
            )
        )}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
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
            variant="main"
            startIcon={<IconCheck />}
            onClick={handleSaveChanges}
          >
            {t('tr_done')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditUpcomingEvent;
