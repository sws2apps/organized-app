import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { AssignmentType } from '../../classes/AssignmentType';

const PartType = (props) => {
  const { t } = useTranslation('ui');

  const [type, setType] = useState('');

  const readOnly = props.readOnly;

  const handleChangeType = (e) => {
    setType(e.target.value);
    if (props.ayf === 1) {
      props.setAss1Type(e.target.value);
    } else if (props.ayf === 2) {
      props.setAss2Type(e.target.value);
    } else if (props.ayf === 3) {
      props.setAss3Type(e.target.value);
    } else if (props.ayf === 4) {
      props.setAss4Type(e.target.value);
    }
  };

  const renderPartType = (type) => {
    return (
      <MenuItem key={type.value} value={type.value}>
        {type.label}
      </MenuItem>
    );
  };

  useEffect(() => {
    setType(props.assType);
  }, [props.assType]);

  return (
    <>
      {AssignmentType.AYFOnly().length > 0 && (
        <TextField
          id="outlined-select-type"
          select
          label={t('partType')}
          size="small"
          InputProps={{ readOnly }}
          value={type}
          onChange={(e) => handleChangeType(e)}
          sx={{ minWidth: '250px' }}
        >
          <MenuItem value={''}>
            <em>{t('nothing')}</em>
          </MenuItem>
          {AssignmentType.AYFOnly().map((partType) => renderPartType(partType))}
        </TextField>
      )}
    </>
  );
};

export default PartType;
