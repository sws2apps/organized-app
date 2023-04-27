import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { alpha } from '@mui/material/styles';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { themeOptionsState } from '../../states/theme';

const PersonCustomFilter = () => {
  const { t } = useTranslation('ui');

  const theme = useTheme();

  const themeOptions = useRecoilValue(themeOptionsState);

  let searchParams = localStorage.getItem('searchParams');
  searchParams = searchParams ? JSON.parse(searchParams) : {};
  const filterInitial = searchParams.filter === undefined ? 'allPersons' : searchParams.filter;

  const [filter, setFilter] = useState(filterInitial);

  useEffect(() => {
    let searchParams = localStorage.getItem('searchParams');
    searchParams = searchParams ? JSON.parse(searchParams) : {};
    searchParams.filter = filter;

    localStorage.setItem('searchParams', JSON.stringify(searchParams));
  }, [filter]);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <TextField
        id="outlined-select-service"
        select
        size="small"
        sx={{
          borderRadius: '5px',
          flexGrow: 1,
          maxWidth: '350px',
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
        <MenuItem value="allPublishers">{t('allPublishers')}</MenuItem>
        <MenuItem value="unbaptizedPublishers">{t('unbaptizedPublishers')}</MenuItem>
        <MenuItem value="baptizedPublishers">{t('baptizedPublishers')}</MenuItem>
        <MenuItem value="auxiliaryPioneers">{t('auxiliaryPioneers')}</MenuItem>
        <MenuItem value="regularPioneers">{t('regularPioneers')}</MenuItem>
        <MenuItem value="appointedBrothers">{t('appointedBrothers')}</MenuItem>
      </TextField>
    </Box>
  );
};

export default PersonCustomFilter;
