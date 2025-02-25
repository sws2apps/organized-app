import ThemeSwitch from '@components/theme_switch';
import useThemeSwitcher from './useThemeSwitcher';
import ThemeChangeConfirm from './themeChangeConfirm';
import { useKeyboardShortcut } from '@hooks/index';

const ThemeSwitcher = () => {
  const {
    isDark,
    handleChangeTheme,
    isOpenConfirm,
    handleCloseConfirm,
    handleOverrideThemeAuto,
  } = useThemeSwitcher();

  useKeyboardShortcut(['Control', 'Shift', 'T'], () => {
    handleChangeTheme(!isDark);
  });

  return (
    <>
      {isOpenConfirm && (
        <ThemeChangeConfirm
          open={isOpenConfirm}
          onClose={handleCloseConfirm}
          onConfirm={handleOverrideThemeAuto}
        />
      )}
      <ThemeSwitch checked={isDark} onChange={handleChangeTheme} />
    </>
  );
};

export default ThemeSwitcher;
