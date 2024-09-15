import { useAppTranslation } from '@hooks/index';
import { HorizontalFlex, StyledCardBox, VerticalFlex } from './index.styles';
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
import { IconAdd, IconCheck, IconClose, IconDelete } from '@components/icons';
import { Box } from '@mui/material';

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

// Should look the same as EventType
// But this contain the date, and title is named "custom"
export interface EventValues {
  date?: Date | null;
  time?: Date | null;
  type?: eventValue;
  custom?: string;
  description?: string;
}

const AddEvent = ({
  data = [{}],
  titleTextKey = 'tr_addUpcomingEvent',
  onDone,
  onCancel,
}: {
  data?: EventValues[];
  titleTextKey?: string;
  onDone?: (data: EventType[]) => void;
  onCancel?: () => void;
}) => {
  const [values, setValues] = useState<EventValues[]>(data);

  const { t } = useAppTranslation();

  const handleDone = () => {
    onDone?.(
      values.map((v) => ({
        type: v.type,
        description: v.description,
        time: v.time ? v.time.toLocaleTimeString() : '',
        title: v.type === 'tr_custom' ? v.custom : undefined,
      }))
    );
  };

  const handleCancel = () => onCancel && onCancel();

  const updateValues = (index: number, newData: EventValues) => {
    const newValues = [...values];
    newValues[index] = newData;
    setValues(newValues);
  };

  const addValues = () => setValues([...values, {}]);

  const removeValues = (index: number) => {
    const newValues = [...values];
    newValues.splice(index, 1);
    setValues(newValues);
    if (newValues.length === 0) {
      handleDone();
    }
  };

  return (
    <StyledCardBox>
      <span className="h2" style={{ color: 'var(--black)' }}>
        {t(titleTextKey)}
      </span>
      <VerticalFlex>
        {values.map((value, index) => (
          <EventFields
            key={index}
            values={value}
            setValues={(data: EventValues) => updateValues(index, data)}
            addValues={addValues}
            removeValues={() => removeValues(index)}
          />
        ))}
      </VerticalFlex>
      <HorizontalFlex sx={{ justifyContent: 'flex-end' }}>
        <Button variant="secondary" color="red" onClick={handleCancel}>
          <IconClose sx={{ marginRight: '8px' }} />
          {t('tr_cancel')}
        </Button>
        <Button variant="secondary" onClick={handleDone}>
          <IconCheck sx={{ marginRight: '8px' }} />
          {t('tr_done')}
        </Button>
      </HorizontalFlex>
    </StyledCardBox>
  );
};

const EventFields = ({
  values,
  setValues,
  addValues,
  removeValues,
}: {
  values: EventValues;
  setValues: (data: EventValues) => void;
  addValues: () => void;
  removeValues: () => void;
}) => {
  const { t } = useAppTranslation();

  return (
    <VerticalFlex
      sx={{
        paddingBlock: '16px',
        borderBottom: '1px solid var(--accent-200)',
        '&:not(:last-child) #add-btn': {
          display: 'none',
        },
      }}
    >
      <HorizontalFlex>
        <DatePicker
          view="input"
          label={t('tr_date')}
          value={values.date ?? null}
          onChange={(value) => setValues({ ...values, date: value })}
        />
        <TimePicker
          ampm
          label={t('tr_timerLabelTime')}
          value={values.time ?? null}
          onChange={(value) => setValues({ ...values, time: value })}
          sx={{
            flexBasis: 'unset',
            flexGrow: 'unset',
            flexShrink: 'unset',
            '.MuiInputBase-root': {
              height: '48px !important',
            },
            '.MuiFormLabel-root[data-shrink=false]': {
              top: '-3px !important',
            },
          }}
        />
        <Select
          label={t('tr_eventType')}
          value={values.type ?? 'tr_circuitOverseerWeek'}
          onChange={(event) =>
            setValues({ ...values, type: event.target.value as eventValue })
          }
          sx={{
            '.MuiInputBase-root': {
              height: '48px',
            },
          }}
        >
          {options.map((option) => (
            <MenuItem value={option} key={option}>
              <HorizontalFlex sx={{ gap: '8px' }}>
                <EventIcon type={option} color={'var(--black)'} />
                <span style={{ color: 'var(--black)' }}>{t(option)}</span>
              </HorizontalFlex>
            </MenuItem>
          ))}
        </Select>
      </HorizontalFlex>
      <HorizontalFlex
        sx={{
          '@media (max-width: 700px)': {
            flexDirection: 'column',
          },
        }}
      >
        {values.type === 'tr_custom' && (
          <TextField
            sx={{ input: { color: 'var(--black) !important' } }}
            label={t('tr_custom')}
            value={values.custom ?? ''}
            onChange={(event) =>
              setValues({ ...values, custom: event.target.value })
            }
          />
        )}
        <TextField
          sx={{ input: { color: 'var(--black) !important' } }}
          label={t('tr_additionalInfo')}
          value={values.description ?? ''}
          onChange={(event) =>
            setValues({ ...values, description: event.target.value })
          }
        />
      </HorizontalFlex>
      <HorizontalFlex sx={{ justifyContent: 'space-between' }}>
        <Button
          sx={{ minHeight: 'auto' }}
          variant="small"
          color="red"
          onClick={removeValues}
        >
          <IconDelete sx={{ marginRight: '8px' }} />
          {t('tr_remove')}
        </Button>
        <Box id="add-btn">
          <Button
            sx={{ minHeight: 'auto' }}
            variant="small"
            onClick={addValues}
          >
            <IconAdd sx={{ marginRight: '8px' }} />
            {t('tr_add')}
          </Button>
        </Box>
      </HorizontalFlex>
    </VerticalFlex>
  );
};

export default AddEvent;
