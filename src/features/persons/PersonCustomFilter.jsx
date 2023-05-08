import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { alpha } from '@mui/material/styles';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { themeOptionsState } from '../../states/theme';
import { FSGList } from '../../classes/FSGList';

const PersonCustomFilter = () => {
  const { t } = useTranslation('ui');

  const theme = useTheme();

  const themeOptions = useRecoilValue(themeOptionsState);

  let searchParams = localStorage.getItem('searchParams');
  searchParams = searchParams ? JSON.parse(searchParams) : {};
  const filterInitial = searchParams.filter === undefined ? 'allPersons' : searchParams.filter;

  const [filter, setFilter] = useState(filterInitial);
  const [FSGOptions, setFSGOptions] = useState([]);
  const [currentFSG, setCurrentFSG] = useState('');

  useEffect(() => {
    let searchParams = localStorage.getItem('searchParams');
    searchParams = searchParams ? JSON.parse(searchParams) : {};
    searchParams.filter = filter;
    searchParams.fsg = currentFSG;

    localStorage.setItem('searchParams', JSON.stringify(searchParams));
  }, [filter, currentFSG]);

  useEffect(() => {
    const FSGCurrent = FSGList.getCurrent();
    if (FSGCurrent) {
      let options = [];

      for (const group of FSGCurrent.groups) {
        options.push(group.group_uid);
      }

      setFSGOptions(options);
    }
  }, []);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
      <TextField
        id="outlined-select-service"
        select
        size="small"
        sx={{
          borderRadius: '5px',
          width: '350px',
          backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.25),
          '&:hover': {
            backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.15),
          },
        }}
        defaultValue="allPersons"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <MenuItem value="allPersons">{t('allPersons')}</MenuItem>
        <Divider />
        <MenuItem value="allPublishers">{t('allPublishers')}</MenuItem>
        <MenuItem value="fieldServiceGroup">{t('fieldServiceGroup')}</MenuItem>
        <MenuItem value="unbaptizedPublishers">{t('unbaptizedPublishers')}</MenuItem>
        <MenuItem value="baptizedPublishers">{t('baptizedPublishers')}</MenuItem>
        <MenuItem value="auxiliaryPioneers">{t('auxiliaryPioneers')}</MenuItem>
        <MenuItem value="regularPioneers">{t('regularPioneers')}</MenuItem>
        <MenuItem value="appointedBrothers">{t('appointedBrothers')}</MenuItem>
        <Divider />
        <MenuItem value="inactivePublishers">{t('inactivePublishers')}</MenuItem>
      </TextField>
      {filter === 'fieldServiceGroup' && (
        <TextField
          id="outlined-select-field-service-group"
          select
          size="small"
          sx={{
            borderRadius: '5px',
            width: '280px',
            backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.25),
            '&:hover': {
              backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.15),
            },
          }}
          value={currentFSG}
          onChange={(e) => setCurrentFSG(e.target.value)}
        >
          {FSGOptions.map((group, index) => (
            <MenuItem key={group} value={group}>
              {`${t('fieldServiceGroup')} ${index + 1}`}
            </MenuItem>
          ))}
        </TextField>
      )}
    </Box>
  );
};

export default PersonCustomFilter;
