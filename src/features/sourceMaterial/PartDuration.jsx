import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

const PartDuration = (props) => {
  const { t } = useTranslation();

  const [partTime, setPartTime] = useState('');

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
    }
  };

  useEffect(() => {
    setPartTime(props.assTime);
    return () => {
      //clean
    };
  }, [props.assTime]);

  return (
    <TextField
      id="outlined-select-duration"
      select
      label={t('sourceMaterial.partDuration')}
      size="small"
      value={partTime}
      onChange={(e) => handleChangeTime(e)}
      sx={{ minWidth: '130px' }}
    >
      <MenuItem value="">
        <em>{t('sourceMaterial.nothing')}</em>
      </MenuItem>
      <MenuItem value={1}>1 min.</MenuItem>
      <MenuItem value={2}>2 min.</MenuItem>
      <MenuItem value={3}>3 min.</MenuItem>
      <MenuItem value={4}>4 min.</MenuItem>
      <MenuItem value={5}>5 min.</MenuItem>
      <MenuItem value={6}>6 min.</MenuItem>
      <MenuItem value={7}>7 min.</MenuItem>
      <MenuItem value={8}>8 min.</MenuItem>
      <MenuItem value={9}>9 min.</MenuItem>
      <MenuItem value={10}>10 min.</MenuItem>
    </TextField>
  );
};

export default PartDuration;
