import { useAppTranslation } from '@hooks/index';
import { HorizontalFlex, StyledCardBox } from './index.styles';
import {
  Button,
  DatePicker,
  MenuItem,
  Select,
  TextField,
  TimePicker,
} from '@components/index';
import { EventType, eventValue } from './index.types';
import EventIcon from './EventIcon';
import { useState } from 'react';
import { IconCheck, IconClose, IconDelete } from '@components/icons';

const options: eventValue[] = [
  'tr_circuitOverseerWeek',
  'tr_pioneerWeek',
  'tr_memorialWeek',
  'tr_conventionWeek',
  'tr_assemblyWeek',
  'tr_internationalConventionWeek',
  'tr_specialCampaignWeek',
  'tr_theocraticTrainingWeek',
  'tr_hallMaintenanceTrainingWeek',
  'tr_bethelTour',
  'tr_congregationTrip',
  'tr_specialProgram',
  'tr_publicWitnessing',
  'tr_kingdomInauguration',
  'tr_languageCourse',
  'tr_annualMeeting',
  'tr_custom',
];

const AddEvent = ({
  onDone,
  onCancel,
}: {
  onDone?: (data: EventType) => void;
  onCancel?: () => void;
}) => {
  const [date, setDate] = useState<Date | null>();
  const [time, setTime] = useState<Date | null>();
  const [type, setType] = useState<eventValue>('tr_circuitOverseerWeek');
  const [custom, setCustom] = useState<string>('');
  const [additionalInfo, setAdditionalInfo] = useState<string>('');

  const { t } = useAppTranslation();

  const resetState = () => {
    setDate(null);
    setTime(null);
    setType('tr_circuitOverseerWeek');
    setCustom('');
    setAdditionalInfo('');
  };

  const handleDone = () => {
    const data: EventType = {
      time: time ? time.toLocaleTimeString() : '',
      type,
      title: type === 'tr_custom' ? custom : undefined,
      description: additionalInfo,
    };
    resetState();
    onDone && onDone(data);
  };

  const handleCancel = () => {
    resetState();
    onCancel && onCancel();
  };

  return (
    <StyledCardBox>
      <span className="h2" style={{ color: 'var(--black)' }}>
        {t('tr_addUpcomingEvent')}
      </span>
      <HorizontalFlex>
        <DatePicker
          view="input"
          label={t('tr_date')}
          value={date}
          onChange={(value) => setDate(value)}
        />
        <TimePicker
          ampm
          label={t('tr_timerLabelTime')}
          value={time}
          onChange={(value) => setTime(value)}
          sx={{
            flexBasis: 'unset',
            flexGrow: 'unset',
            flexShrink: 'unset',
          }}
        />
        <Select
          label={t('tr_eventType')}
          value={type}
          onChange={(event) => setType(event.target.value as eventValue)}
        >
          {options.map((option) => (
            <MenuItem value={option} key={option}>
              <HorizontalFlex sx={{ gap: '8px' }}>
                <EventIcon type={option} />
                <span style={{ color: 'var(--black)' }}>{t(option)}</span>
              </HorizontalFlex>
            </MenuItem>
          ))}
        </Select>
      </HorizontalFlex>
      {type === 'tr_custom' && (
        <TextField
          sx={{ input: { color: 'var(--black) !important' } }}
          label={t('tr_custom')}
          value={custom}
          onChange={(event) => setCustom(event.target.value)}
        />
      )}
      <TextField
        sx={{ input: { color: 'var(--black) !important' } }}
        label={t('tr_additionalInfo')}
        value={additionalInfo}
        onChange={(event) => setAdditionalInfo(event.target.value)}
      />
      <HorizontalFlex sx={{ justifyContent: 'space-between' }}>
        <Button variant="secondary" color="red">
          <IconDelete sx={{ marginRight: '8px' }} />
          {t('tr_cancel')}
        </Button>
        <HorizontalFlex>
          <Button variant="secondary" color="red" onClick={handleCancel}>
            <IconClose sx={{ marginRight: '8px' }} />
            {t('tr_cancel')}
          </Button>
          <Button variant="secondary" onClick={handleDone}>
            <IconCheck sx={{ marginRight: '8px' }} />
            {t('tr_done')}
          </Button>
        </HorizontalFlex>
      </HorizontalFlex>
    </StyledCardBox>
  );
};

export default AddEvent;
