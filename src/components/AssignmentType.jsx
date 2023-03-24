import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { styled, lighten, darken } from '@mui/system';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { AssignmentType as AssignmentTypeList } from '../classes/AssignmentType';

const GroupHeader = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: '-8px',
  padding: '4px 10px',
  color: theme.palette.primary.main,
  backgroundColor:
    theme.palette.mode === 'light'
      ? lighten(theme.palette.primary.light, 0.85)
      : darken(theme.palette.primary.main, 0.8),
}));

const GroupItems = styled('ul')({
  padding: 0,
});

const AssignmentType = ({ student, assignable, currentType, handleChangeType }) => {
  const { t } = useTranslation('ui');

  const [localList, setLocalList] = useState([]);
  const [isFemale, setIsFemale] = useState(false);
  const [value, setValue] = useState(null);

  const handleChange = (newVal) => {
    setValue(newVal);
    handleChangeType(newVal.value);
  };

  const getHeaderLabel = (value) => {
    if (value === 'mm') return t('midweekMeeting');
    if (value === 'tgw') return t('treasuresPart');
    if (value === 'ayf') return t('applyFieldMinistryPart');
    if (value === 'lc') return t('livingPart');

    return '';
  };

  useEffect(() => {
    setIsFemale(student.isFemale);
  }, [student.isFemale]);

  useEffect(() => {
    if (assignable) {
      let data = AssignmentTypeList.local().filter((assType) => assType.assignable === true);

      if (isFemale) {
        data = data.filter((assType) => assType.maleOnly !== true);
      }

      setLocalList(data);
    } else {
      setLocalList(AssignmentTypeList.local());
    }
  }, [assignable, isFemale]);

  useEffect(() => {
    const find = AssignmentTypeList.local().find((assType) => assType.value === currentType);
    setValue(find);
  }, [currentType]);

  return (
    <>
      {localList.length > 0 && (
        <Autocomplete
          id="grouped-demo"
          size="small"
          sx={{ minWidth: '260px' }}
          options={localList}
          groupBy={(option) => option.type}
          getOptionLabel={(option) => (option.label ? option.label : '')}
          onChange={(e, value) => handleChange(value)}
          value={value}
          disableClearable={true}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          renderInput={(params) => <TextField {...params} label={t('partType')} />}
          renderGroup={(params) => (
            <li key={`group-${params.group}`}>
              <GroupHeader>{getHeaderLabel(params.group)}</GroupHeader>
              <GroupItems>
                {params.children.sort((a, b) => {
                  return a.key > b.key ? 1 : -1;
                })}
              </GroupItems>
            </li>
          )}
        />
      )}
    </>
  );
};

export default AssignmentType;
