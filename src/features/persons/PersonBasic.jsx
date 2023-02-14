import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import { generateDisplayName } from '../../utils/person';

const PersonBasic = ({ isMale, isFemale, name, displayName, setIsMale, setIsFemale, setName, setDisplayName }) => {
  const { t } = useTranslation('ui');

  const [isErrorName, setIsErrorName] = useState(false);
  const [isErrorDisplayName, setIsErrorDisplayName] = useState(false);

  const handleNameChange = (name) => {
    setIsErrorName(false);
    setIsErrorDisplayName(false);
    if (name === '') {
      setIsErrorName(true);
      setIsErrorDisplayName(true);
    }
    setName(name);
    setDisplayName(generateDisplayName(name));
  };

  const handleDisplayNameChange = (name) => {
    setIsErrorDisplayName(false);
    if (name === '') {
      setIsErrorDisplayName(true);
    }
    setDisplayName(name);
  };

  const handleMaleCheck = (value) => {
    setIsMale(value);
    setIsFemale(!value);
  };

  const handleFemaleCheck = (value) => {
    setIsMale(!value);
    setIsFemale(value);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          marginRight: '10px',
        }}
      >
        <TextField
          label={t('name')}
          variant="outlined"
          size="small"
          autoComplete="off"
          required
          error={isErrorName ? true : false}
          sx={{
            width: '320px',
            margin: '5px 5px 8px 0',
          }}
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
        />
        <TextField
          label={t('displayName')}
          variant="outlined"
          size="small"
          autoComplete="off"
          required
          error={isErrorDisplayName ? true : false}
          helperText={isErrorDisplayName ? 'Mila fenoina' : null}
          sx={{
            width: '210px',
            margin: '5px 5px 5px 0',
          }}
          value={displayName}
          onChange={(e) => handleDisplayNameChange(e.target.value)}
        />
      </Box>
      <Box sx={{ display: 'flex' }}>
        <FormControlLabel
          control={<Checkbox checked={isMale} onChange={(e) => handleMaleCheck(e.target.checked)} color="primary" />}
          label={t('male')}
        />
        <FormControlLabel
          control={
            <Checkbox checked={isFemale} onChange={(e) => handleFemaleCheck(e.target.checked)} color="primary" />
          }
          label={t('female')}
        />
      </Box>
    </Box>
  );
};

export default PersonBasic;
