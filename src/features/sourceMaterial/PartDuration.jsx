import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

const PartDuration = (props) => {
  const { t } = useTranslation('ui');

  const [partTime, setPartTime] = useState('');
  const maxTime = Array.from({ length: props.max }, (a, b) => b + 1);

  const handleChangeTime = async (e) => {
    setPartTime(e.target.value);
    if (props.ayf === 1) {
      props.setAss1Time(e.target.value);
    } else if (props.ayf === 2) {
      props.setAss2Time(e.target.value);
    } else if (props.ayf === 3) {
      props.setAss3Time(e.target.value);
    } else if (props.ayf === 4) {
      props.setAss4Time(e.target.value);
    } else if (props.lc === 1) {
      props.setLCPart1Time(e.target.value);
    } else if (props.lc === 2) {
      props.setLCPart2Time(e.target.value);
    } else if (props.cbs === true) {
      props.setCBSTime(e.target.value);
    }
  };

  useEffect(() => {
    setPartTime(props.assTime);
  }, [props.assTime]);

  return (
    <TextField
      id="outlined-select-duration"
      select
      label={t('partDuration')}
      size="small"
      value={partTime}
      onChange={(e) => handleChangeTime(e)}
      sx={{ minWidth: '130px' }}
    >
      <MenuItem value="">
        <em>{t('nothing')}</em>
      </MenuItem>
      {maxTime.map((time) => (
        <MenuItem key={time} value={time}>
          {time} min.
        </MenuItem>
      ))}
    </TextField>
  );
};

export default PartDuration;
