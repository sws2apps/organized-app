import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { COLOR_SCHEMES } from '@constants/index';
import { ColorSchemeContainer } from './index.styles';
import useColorSchemeSelector from './useColorSchemeSelector';

const ColorSchemeSwitcher = () => {
  const { t } = useAppTranslation();
  const { colorScheme, handleChangeColor } = useColorSchemeSelector();

  return (
    <Box
      role="radiogroup"
      aria-label={t('tr_colorScheme')}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      {COLOR_SCHEMES.map((value) => (
        <ColorSchemeContainer
          key={value}
          value={value}
          selected={colorScheme}
          label={t(`tr_${value}`)}
          onClick={handleChangeColor}
        />
      ))}
    </Box>
  );
};

export default ColorSchemeSwitcher;
