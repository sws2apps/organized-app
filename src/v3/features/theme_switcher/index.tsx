import ThemeSwitch from '@components/theme_switch';
import useThemeSwitcher from './useThemeSwitcher';

const ThemeSwitcher = () => {
  const { isDark, handleChangeTheme } = useThemeSwitcher();

  return <ThemeSwitch checked={isDark} onChange={handleChangeTheme} />;
};

export default ThemeSwitcher;
