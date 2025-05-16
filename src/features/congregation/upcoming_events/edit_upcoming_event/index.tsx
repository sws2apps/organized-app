import { Box, IconButton } from '@mui/material';
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
import { IconAdd, IconCheck, IconClose, IconDelete } from '@components/icons';
import Divider from '@components/divider';
import { decorationsForEvent } from '../decorations_for_event';
import { UpcomingEventCategory } from '@definition/upcoming_events';
import useEditUpcomingEvent from './useEditUpcomingEvent';

const EditUpcomingEvent = (props: EditUpcomingEventProps) => {
  const { t } = useAppTranslation();
  const { desktopUp, tabletUp } = useBreakpoints();

  const {
    hour24,
    localEvent,
    localEventDates,
    handleChangeEventType,
    handleChangeEventCustomTitle,
    handleChangeEventDescription,
    handleChangeEventDateDate,

    handleChangeEventDateEndTime,
    handleChangeEventDateStartTime,
    handleChangeEventDateComment,
    handleDeleteEventDate,
    handleAddEventDate,
    handleSaveEvent,
    handleDeleteEvent,
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
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography className="h2" color="var(--black)">
          {props.type == 'add'
            ? t('tr_addUpcomingEvent')
            : t('tr_editUpcomingEvent')}
        </Typography>
        {props.type === 'edit' &&
          (tabletUp ? (
            <Button
              variant="small"
              color="red"
              onClick={handleDeleteEvent}
              sx={{ minHeight: '32px', height: '32px' }}
              startIcon={<IconDelete />}
            >
              {t('tr_delete')}
            </Button>
          ) : (
            <IconButton onClick={handleDeleteEvent} color="error">
              <IconDelete color="var(--red-main)" />
            </IconButton>
          ))}
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
        <Typography className="h4" color="var(--black)">
          {t('tr_eventDate-s')}
        </Typography>
        {localEventDates.map((event_date, event_date_index) => (
          <Box
            key={event_date.start}
            sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: '16px',
                justifyContent: 'space-between',
                flexWrap: !desktopUp ? 'wrap' : 'nowrap',
              }}
            >
              <Box sx={{ width: !desktopUp ? '100%' : 'auto' }}>
                <DatePicker
                  view="input"
                  label={t('tr_date')}
                  value={new Date(event_date.start)}
                  onChange={(value) =>
                    handleChangeEventDateDate(value, event_date_index)
                  }
                />
              </Box>
              <TimePicker
                ampm={!hour24}
                sx={{
                  minWidth: '150px',
                }}
                label={t('tr_startTime')}
                value={new Date(event_date.start)}
                onChange={(value) =>
                  handleChangeEventDateStartTime(value, event_date_index)
                }
              />
              <TimePicker
                ampm={!hour24}
                sx={{
                  minWidth: '150px',
                }}
                label={t('tr_endTime')}
                value={new Date(event_date.end)}
                onChange={(value) =>
                  handleChangeEventDateEndTime(value, event_date_index)
                }
              />
              <TextField
                label={t('tr_comments')}
                onChange={(event) =>
                  handleChangeEventDateComment(
                    event.target.value,
                    event_date_index
                  )
                }
              />
              {desktopUp ? (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '12px',
                  }}
                >
                  <IconButton
                    sx={{ padding: 0 }}
                    onClick={() => handleDeleteEventDate(event_date_index)}
                  >
                    <IconDelete color="var(--red-main)" />
                  </IconButton>
                </Box>
              ) : (
                <>
                  <Button
                    variant="small"
                    color="red"
                    startIcon={<IconDelete />}
                    disableAutoStretch
                    sx={{ minHeight: '32px', height: '32px' }}
                  >
                    {t('tr_delete')}
                  </Button>
                  {event_date_index == localEventDates.length - 1 && (
                    <Button
                      variant="small"
                      startIcon={<IconAdd />}
                      disableAutoStretch
                      onClick={handleAddEventDate}
                      sx={{
                        minHeight: '32px',
                        height: '32px',
                        width: 'fit-content',
                      }}
                    >
                      {t('tr_add')}
                    </Button>
                  )}
                </>
              )}
            </Box>
            {!desktopUp && <Divider color="var(--accent-200)" />}
          </Box>
        ))}
        {desktopUp && (
          <>
            <Button
              variant="small"
              startIcon={<IconAdd />}
              disableAutoStretch
              onClick={handleAddEventDate}
              sx={{ minHeight: '32px', height: '32px', width: 'fit-content' }}
            >
              {t('tr_add')}
            </Button>
            <Divider color="var(--accent-200)" />
          </>
        )}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '16px',
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
    </Box>
  );
};

export default EditUpcomingEvent;
