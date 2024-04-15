import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SummaryField from './SummaryField';
import { S88s } from '../../classes/S88s';
import { refreshReportState } from '../../states/report';

const MeetingSummary = ({ month, type, serviceYear }) => {
  const { t } = useTranslation('ui');

  const refresh = useRecoilValue(refreshReportState);

  const [meetingCount, setMeetingCount] = useState('');
  const [totalAttendance, setTotalAttendance] = useState('');
  const [averageAttendance, setAverageAttendance] = useState('');

  useEffect(() => {
    if (serviceYear && serviceYear !== '' && month !== undefined && month !== '') {
      const S88 = S88s.list.find((S88) => S88.uid === serviceYear);
      if (S88) {
        let monthValue = month < 8 ? S88.value.split('-')[1] : S88.value.split('-')[0];
        monthValue += '/';
        monthValue += String(month + 1).padStart(2, 0);
        monthValue += '/01';

        const S3 = S88.months.find((item) => item.month_value === monthValue);

        if (S3) {
          const data = S3.summaryMeeting(type);
          setMeetingCount(data.count);
          setTotalAttendance(data.total);
          setAverageAttendance(data.average);
        }
      }
    }
  }, [refresh, month, serviceYear, type]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <Typography sx={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}>
        {type === 'midweek' ? t('midweekMeeting') : t('weekendMeeting')}
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <SummaryField field="totalMeetings" value={meetingCount} />
        <SummaryField field="totalAttendance" value={totalAttendance} />
        <SummaryField field="average" value={averageAttendance} />
      </Box>
    </Box>
  );
};

export default MeetingSummary;
