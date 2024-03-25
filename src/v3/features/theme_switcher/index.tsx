import ThemeSwitch from '@components/theme_switch';
import useThemeSwitcher from './useThemeSwitcher';
import ThemeChangeConfirm from './components/themeChangeConfirm';

const ThemeSwitcher = () => {
  const { isDark, handleChangeTheme, isOpenConfirm, handleCloseConfirm, handleOverrideThemeAuto } = useThemeSwitcher();

  return (
    <>
      {isOpenConfirm && (
        <ThemeChangeConfirm open={isOpenConfirm} onClose={handleCloseConfirm} onConfirm={handleOverrideThemeAuto} />
      )}
      <ThemeSwitch checked={isDark} onChange={handleChangeTheme} />
    </>
  );
};

export default ThemeSwitcher;
