import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

const LCPartDuration = (props) => {
  const { t } = useTranslation();

  const [partTime, setPartTime] = useState('');

  const handleChangeTime = async (e) => {
    setPartTime(e.target.value);
    if (props.lc === 1) {
      props.setLCPart1Time(e.target.value);
    } else if (props.lc === 2) {
      props.setLCPart2Time(e.target.value);
    }
  };

  useEffect(() => {
    setPartTime(props.lcTime);
    return () => {
      //clean
    };
  }, [props.lcTime]);

  return (
    <TextField
      id="outlined-select-duration"
      select
      label={t('sourceMaterial.partDuration')}
      size="small"
      value={partTime}
      onChange={(e) => handleChangeTime(e)}
      sx={{
        minWidth: '130px',
      }}
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
      <MenuItem value={11}>11 min.</MenuItem>
      <MenuItem value={12}>12 min.</MenuItem>
      <MenuItem value={13}>13 min.</MenuItem>
      <MenuItem value={14}>14 min.</MenuItem>
      <MenuItem value={15}>15 min.</MenuItem>
    </TextField>
  );
};

export default LCPartDuration;
