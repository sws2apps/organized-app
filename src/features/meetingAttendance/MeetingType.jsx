import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AttendanceCount from './AttendanceCount';
import { S88s } from '../../classes/S88s';

const MeetingType = ({ type, serviceYear, month, masterRefresh }) => {
  const { t } = useTranslation('ui');

  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState(0);
  const [refresh, setRefresh] = useState(true);

  useEffect(() => {
    if (serviceYear && month && serviceYear !== '' && month !== '') {
      const S88 = S88s.list.find((S88) => S88.uid === serviceYear);
      const S3 = S88.months.find((item) => item.month_value === month);
      if (S3) {
        const data = type === 'midweek' ? S3.midweek_meeting : S3.weekend_meeting;

        let total = 0;
        let count = 0;
        for (const item of data) {
          if (item.count !== '') {
            total += +item.count;
            count++;
          }
        }

        setAverage(total === 0 ? 0 : Math.round(total / count));
        setTotal(total);
      }
    }
  }, [month, serviceYear, type, refresh, masterRefresh]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
      <Typography sx={{ fontWeight: 'bold' }}>
        {type === 'midweek' ? t('midweekMeeting') : t('weekendMeeting')}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
        <AttendanceCount
          type={type}
          index={1}
          label={t('1stWeekLabelS88')}
          serviceYear={serviceYear}
          month={month}
          refresh={refresh}
          setRefresh={(value) => setRefresh(value)}
          masterRefresh={masterRefresh}
        />
        <AttendanceCount
          type={type}
          index={2}
          label={t('2ndWeekLabelS88')}
          serviceYear={serviceYear}
          month={month}
          refresh={refresh}
          setRefresh={(value) => setRefresh(value)}
          masterRefresh={masterRefresh}
        />
        <AttendanceCount
          type={type}
          index={3}
          label={t('3rdWeekLabelS88')}
          serviceYear={serviceYear}
          month={month}
          refresh={refresh}
          setRefresh={(value) => setRefresh(value)}
          masterRefresh={masterRefresh}
        />
        <AttendanceCount
          type={type}
          index={4}
          label={t('4thWeekLabelS88')}
          serviceYear={serviceYear}
          month={month}
          refresh={refresh}
          setRefresh={(value) => setRefresh(value)}
          masterRefresh={masterRefresh}
        />
        <AttendanceCount
          type={type}
          index={5}
          label={t('5thWeekLabelS88')}
          serviceYear={serviceYear}
          month={month}
          refresh={refresh}
          setRefresh={(value) => setRefresh(value)}
          masterRefresh={masterRefresh}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <AttendanceCount label={t('total')} value={total} />
          <AttendanceCount label={t('average')} value={average} />
        </Box>
      </Box>
    </Box>
  );
};

export default MeetingType;
