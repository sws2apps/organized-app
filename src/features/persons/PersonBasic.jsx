import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';

const PersonBasic = ({ isMale, isFemale, name, displayName, setIsMale, setIsFemale, setName, setDisplayName }) => {
  const { t } = useTranslation();

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
    generateDisplayName(name);
  };

  const generateDisplayName = (name) => {
    if (name === '') {
      setDisplayName('');
    } else {
      var txtArray = name.split(' ');
      if (txtArray.length === 1) {
        setDisplayName(name);
      } else {
        var varDisplay = '';
        for (let i = 0; i < txtArray.length; i++) {
          if (i === txtArray.length - 1) {
            varDisplay += txtArray[i];
          } else {
            varDisplay += txtArray[i].substring(0, 1) + '. ';
          }
        }
        setDisplayName(varDisplay);
      }
    }
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
          label={t('global.name')}
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
          label={t('global.displayName')}
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
          label={t('persons.male')}
        />
        <FormControlLabel
          control={
            <Checkbox checked={isFemale} onChange={(e) => handleFemaleCheck(e.target.checked)} color="primary" />
          }
          label={t('persons.female')}
        />
      </Box>
    </Box>
  );
};

export default PersonBasic;
