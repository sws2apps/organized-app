import { Box, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { Field, FieldContainer } from './index.styles';
import { ServiceTimeProps } from './index.types';
import useServiceTime from './useServiceTime';
import BibleStudiesList from './bible_studies_list';
import BibleStudySelector from './bible_study_selector';
import Button from '@components/button';
import DatePicker from '@components/date_picker';
import HoursCreditPresets from '../../hours_credit_presets';
import HoursEditor from '@features/ministry/report/hours_editor';
import StandardEditor from '@features/ministry/report/standard_editor';
import Typography from '@components/typography';

const ServiceTime = (props: ServiceTimeProps) => {
  const { isEdit, onClose, date, maxDate, minDate, onDateChange } = props;

  const { t } = useAppTranslation();

  const { tabletUp } = useBreakpoints();

  const {
    bibleStudyRef,
    handleHoursChange,
    hours,
    bibleStudies,
    handleBibleStudiesChange,
    bibleStudiesValidator,
    handleSaveReport,
    hoursCreditEnabled,
    hoursEnabled,
    handleHoursCreditChange,
    hoursCredit,
    hoursRef,
    handleSelectPreset,
  } = useServiceTime(props);

  return (
    <Box
      sx={{
        padding: '24px',
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
      className="pop-up-shadow"
    >
      <Stack spacing="8px">
        <Typography className="h2">
          {isEdit ? t('tr_editServiceTime') : t('tr_addServiceTime')}
        </Typography>

        <DatePicker
          minDate={minDate}
          maxDate={maxDate}
          view="button"
          value={new Date(date)}
          onChange={onDateChange}
        />
      </Stack>

      {hoursEnabled && (
        <FieldContainer ref={hoursRef}>
          <Field sx={{ flexDirection: tabletUp ? 'row' : 'column' }}>
            <Typography sx={{ flex: 1 }}>{t('tr_hours')}</Typography>
            <HoursEditor value={hours} onChange={handleHoursChange} />
          </Field>

          {hoursCreditEnabled && (
            <Field sx={{ flexDirection: tabletUp ? 'row' : 'column' }}>
              <HoursCreditPresets
                anchorEl={hoursRef}
                onSelect={handleSelectPreset}
              />
              <HoursEditor
                value={hoursCredit}
                onChange={handleHoursCreditChange}
              />
            </Field>
          )}
        </FieldContainer>
      )}

      <FieldContainer
        sx={{ gap: '8px', alignItems: tabletUp ? 'flex-start' : 'center' }}
        ref={bibleStudyRef}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: tabletUp ? 'row' : 'column',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <BibleStudySelector anchorEl={bibleStudyRef} />
          <StandardEditor
            value={bibleStudies.value}
            onChange={handleBibleStudiesChange}
            validator={bibleStudiesValidator}
          />
        </Box>
        <BibleStudiesList />
      </FieldContainer>

      <Box
        sx={{
          display: 'flex',
          flexDirection: tabletUp ? 'row' : 'column-reverse',
          gap: '8px',
          justifyContent: 'space-between',
        }}
      >
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
        <Button variant="main" onClick={handleSaveReport}>
          {t('tr_add')}
        </Button>
      </Box>
    </Box>
  );
};

export default ServiceTime;
