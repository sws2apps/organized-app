import { useRecoilState } from 'recoil';
import IconButton from '@mui/material/IconButton';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { isLightThemeState } from '../../states/main';

const ThemeSwitcher = () => {
  const [isLight, setIsLight] = useRecoilState(isLightThemeState);

  const handleChangeTheme = () => {
    localStorage.setItem('theme', isLight ? 'dark' : 'light');
    setIsLight(!isLight);
  };

  const styles = {
    color: 'white',
    fontSize: '30px',
  };

  return (
    <IconButton
      onClick={handleChangeTheme}
      sx={{
        borderRadius: '8px',
        '.MuiTouchRipple-ripple .MuiTouchRipple-child': {
          borderRadius: 0,
          backgroundColor: 'rgba(23, 32, 42, .3)',
        },
        marginLeft: '-10px',
      }}
    >
      {isLight && <Brightness4Icon sx={styles} />}
      {!isLight && <Brightness7Icon sx={styles} />}
    </IconButton>
  );
};

export default ThemeSwitcher;
