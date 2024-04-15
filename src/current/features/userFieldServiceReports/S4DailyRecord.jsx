import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import dateFormat from 'dateformat';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import S4GenericField from './S4GenericField';
import S4HourField from './S4HourField';
import S4BibleStudiesField from './S4BibleStudiesField';
import { UserS4Records } from '../../classes/UserS4Records';
import { shortDatePickerFormatState } from '../../states/main';

const S4DailyRecord = ({ isOpen, month, date, setDate }) => {
  const { t } = useTranslation('ui');

  const lastDate = new Date(new Date(month).getFullYear(), new Date(month).getMonth() + 1, 0);

  const shortDatePickerFormat = useRecoilValue(shortDatePickerFormatState);

  const [placements, setPlacements] = useState(0);
  const [videos, setVideos] = useState(0);
  const [returnVisits, setReturnVisits] = useState(0);
  const [duration, setDuration] = useState('');
  const [durationStart, setDurationStart] = useState('');
  const [bibleStudies, setBibleStudies] = useState([]);

  useEffect(() => {
    const handleInitializeReportDate = async () => {
      const tmpDate = dateFormat(date, 'yyyy/mm/dd');

      const data = await UserS4Records.get(tmpDate);
      setPlacements(data.placements);
      setVideos(data.videos);
      setReturnVisits(data.returnVisits);
      setDuration(data.duration);
      setDurationStart(data.duration_start);
      setBibleStudies(data.bibleStudies);
    };

    if (date !== null) {
      handleInitializeReportDate();
    }
  }, [date]);

  useEffect(() => {
    setDate(null);
  }, [month, setDate]);

  return (
    <Collapse
      in={isOpen}
      timeout="auto"
      unmountOnExit
      sx={{ borderBottom: '2px outset', marginBottom: '25px', paddingBottom: '25px' }}
    >
      <Box sx={{ marginTop: '20px' }}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label={t('date')}
            minDate={new Date(month)}
            maxDate={lastDate}
            value={date}
            onChange={(newValue) => setDate(newValue)}
            format={shortDatePickerFormat}
          />
        </LocalizationProvider>

        {date !== null && (
          <Box sx={{ marginTop: '15px' }}>
            <S4GenericField
              month={month}
              currentDate={date}
              fldType="S4Placements"
              value={placements}
              setValue={(value) => setPlacements(value)}
            />
            <S4GenericField
              month={month}
              currentDate={date}
              fldType="S4Video"
              value={videos}
              setValue={(value) => setVideos(value)}
            />
            <S4HourField
              month={month}
              currentDate={date}
              value={duration}
              setValue={(value) => setDuration(value)}
              timeStart={durationStart}
              setTimeStart={(value) => setDurationStart(value)}
            />
            <S4GenericField
              month={month}
              currentDate={date}
              fldType="S4ReturnVisits"
              value={returnVisits}
              setValue={(value) => setReturnVisits(value)}
            />
            <S4BibleStudiesField
              month={month}
              currentDate={date}
              value={bibleStudies}
              setValue={(value) => setBibleStudies(value)}
            />
          </Box>
        )}
      </Box>
    </Collapse>
  );
};

export default S4DailyRecord;
