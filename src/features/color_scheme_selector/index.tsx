import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { ColorSchemeType } from '@definition/app';
import { ColorSchemeContainer } from './index.styles';
import useColorSchemeSelector from './useColorSchemeSelector';

const SCHEMES: Array<{ value: ColorSchemeType; labelKey: string }> = [
  { value: 'blue', labelKey: 'tr_blue' },
  { value: 'green', labelKey: 'tr_green' },
  { value: 'purple', labelKey: 'tr_purple' },
  { value: 'orange', labelKey: 'tr_orange' },
  { value: 'teal', labelKey: 'tr_teal' },
  { value: 'rose', labelKey: 'tr_rose' },
  { value: 'slate', labelKey: 'tr_slate' },
];

const ColorSchemeSwitcher = () => {
  const { t } = useAppTranslation();
  const { colorScheme, handleChangeColor } = useColorSchemeSelector();

  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      {SCHEMES.map(({ value, labelKey }) => (
        <ColorSchemeContainer
          key={value}
          value={value}
          selected={colorScheme}
          label={t(labelKey as never)}
          onClick={handleChangeColor}
        />
      ))}
    </Box>
  );
};

export default ColorSchemeSwitcher;
