import { Box, SxProps, Theme } from '@mui/material';
import ThemeSwitch from '@components/theme_switch';
import useThemeSwitcher from './useThemeSwitcher';
import ThemeChangeConfirm from './themeChangeConfirm';
import { useKeyboardShortcut } from '@hooks/index';

const ThemeSwitcher = ({ sx }: { sx?: SxProps<Theme> }) => {
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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          ...sx,
        }}
      >
        <ThemeSwitch checked={isDark} onChange={handleChangeTheme} />
      </Box>
    </>
  );
};

export default ThemeSwitcher;
