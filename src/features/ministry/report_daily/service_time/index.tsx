import { Box, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { FieldContainer } from './index.styles';
import { ServiceTimeProps } from './index.types';
import useServiceTime from './useServiceTime';
import BibleStudiesEditor from '@features/ministry/bible_studies_editor';
import BibleStudySelector from './bible_study_selector';
import Button from '@components/button';
import DatePicker from '@components/date_picker';
import HoursEditor from '@features/ministry/hours_editor';
import Typography from '@components/typography';

const ServiceTime = ({ isEdit, onClose }: ServiceTimeProps) => {
  const { t } = useAppTranslation();

  const { tabletUp } = useBreakpoints();

  const { date, handleDateChange, maxDate, minDate, bibleStudyRef } =
    useServiceTime();

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
          value={date}
          onChange={handleDateChange}
        />
      </Stack>

      <FieldContainer sx={{ flexDirection: tabletUp ? 'row' : 'column' }}>
        <Typography sx={{ flex: 1 }}>{t('tr_hours')}</Typography>
        <HoursEditor date={date} />
      </FieldContainer>

      <FieldContainer
        sx={{ flexDirection: tabletUp ? 'row' : 'column' }}
        ref={bibleStudyRef}
      >
        <BibleStudySelector anchorEl={bibleStudyRef} date={date} />
        <BibleStudiesEditor />
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
        <Button variant="main">{t('tr_add')}</Button>
      </Box>
    </Box>
  );
};

export default ServiceTime;
