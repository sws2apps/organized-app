import { useTranslation } from 'react-i18next';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

const StudyPoint = ({
  ayf,
  isBRead,
  studyPoint,
  setBReadStudy,
  setAss1Study,
  setAss2Study,
  setAss3Study,
  setAss4Study,
}) => {
  const { t } = useTranslation('ui');

  const handleChangeStudyPoint = async (e) => {
    if (isBRead) {
      setBReadStudy(e.target.value);
    } else if (ayf === 1) {
      setAss1Study(e.target.value);
    } else if (ayf === 2) {
      setAss2Study(e.target.value);
    } else if (ayf === 3) {
      setAss3Study(e.target.value);
    } else if (ayf === 4) {
      setAss4Study(e.target.value);
    }
  };

  return (
    <TextField
      id="outlined-select-duration"
      select
      label={t('studyPoint')}
      size="small"
      value={studyPoint}
      onChange={handleChangeStudyPoint}
      sx={{ minWidth: '120px' }}
    >
      <MenuItem value=""> </MenuItem>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map((study) => (
        <MenuItem key={`th-leson-${study}`} value={study}>
          {study}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default StudyPoint;
