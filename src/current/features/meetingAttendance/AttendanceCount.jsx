import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import TextField from '@mui/material/TextField';
import { S88s } from '../../classes/S88s';
import { refreshReportState } from '../../states/report';

const AttendanceCount = ({ type, label, index, serviceYear, month, value }) => {
  const [refresh, setRefresh] = useRecoilState(refreshReportState);

  const [count, setCount] = useState('');

  const handleUpdateAttendance = async (value) => {
    setCount(value);

    const S88 = S88s.list.find((S88) => S88.uid === serviceYear);
    const S3 = S88.months.find((item) => item.month_value === month);

    await S3.save(type, index, value);
    setRefresh((prev) => !prev);
  };

  useEffect(() => {
    if (serviceYear && month && serviceYear !== '' && month !== '') {
      const S88 = S88s.list.find((S88) => S88.uid === serviceYear);
      if (S88) {
        const S3 = S88.months.find((item) => item.month_value === month);

        if (S3) {
          const data = type === 'midweek' ? S3.midweek_meeting : S3.weekend_meeting;
          const tmpCount = data.find((item) => item.index === index)?.count || '';
          setCount(tmpCount);
        }
      }
    }
  }, [index, month, serviceYear, type, refresh, value]);

  return (
    <TextField
      label={label}
      variant="outlined"
      size="medium"
      autoComplete="off"
      type="number"
      sx={{ width: '120px', '.MuiOutlinedInput-input': { textAlign: 'center' } }}
      value={type ? count : value}
      onChange={type ? (e) => handleUpdateAttendance(e.target.value) : null}
    />
  );
};

export default AttendanceCount;
