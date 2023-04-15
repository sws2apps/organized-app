import { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import { S88s } from '../../classes/S88s';

const AttendanceCount = ({ type, label, index, serviceYear, month, value, refresh, setRefresh, masterRefresh }) => {
  const [count, setCount] = useState('');

  const handleUpdateAttendance = async (value) => {
    setCount(value);

    const S88 = S88s.list.find((S88) => S88.uid === serviceYear);
    const S3 = S88.months.find((item) => item.month_value === month);

    await S3.save(type, index, value);
    setRefresh(!refresh);
  };

  useEffect(() => {
    if (serviceYear && month && serviceYear !== '' && month !== '') {
      const S88 = S88s.list.find((S88) => S88.uid === serviceYear);
      const S3 = S88.months.find((item) => item.month_value === month);

      if (S3) {
        const data = type === 'midweek' ? S3.midweek_meeting : S3.weekend_meeting;
        const tmpCount = data.find((item) => item.index === index)?.count || '';
        setCount(tmpCount);
      }
    }
  }, [index, month, serviceYear, type, masterRefresh]);

  return (
    <TextField
      label={label}
      variant="outlined"
      size="medium"
      autoComplete="off"
      type="number"
      sx={{ width: '120px', '.MuiOutlinedInput-input': { textAlign: 'center' } }}
      value={value ?? count}
      onChange={value ? null : (e) => handleUpdateAttendance(e.target.value)}
    />
  );
};

export default AttendanceCount;
