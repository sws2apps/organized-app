import { useTranslation } from 'react-i18next';
import { styled, lighten, darken } from '@mui/system';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import useAssignmentType from './useAssignmentType';

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

  const { localList, handleChange, value, getHeaderLabel } = useAssignmentType({
    person: student,
    assignable,
    currentType,
    handleChangeType,
  });

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
