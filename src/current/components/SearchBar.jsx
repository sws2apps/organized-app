import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { styled, alpha } from '@mui/material/styles';
import { useTheme } from '@mui/material';
import Box from '@mui/material/Box';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { themeOptionsState } from '../states/theme';

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(0.8, 1, 0.8, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
  '&.MuiInputBase-root': {
    width: '100%',
  },
}));

const SearchBar = ({ minWidth, txtSearch, onChange, onKeyUp, noSpace }) => {
  const { t } = useTranslation('ui');

  const theme = useTheme();

  const themeOptions = useRecoilValue(themeOptionsState);

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: '5px',
        backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.25),
        '&:hover': {
          backgroundColor: alpha(theme.palette.common[themeOptions.searchBg], 0.15),
        },
        marginBottom: noSpace ? null : '5px',
        marginRight: '5px',
        flexGrow: 1,
        minWidth: minWidth,
      }}
    >
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder={t('search')}
        inputProps={{ 'aria-label': 'search' }}
        value={txtSearch}
        onChange={(e) => onChange(e.target.value)}
        onKeyUp={onKeyUp ? onKeyUp : null}
      />
    </Box>
  );
};

export default SearchBar;
