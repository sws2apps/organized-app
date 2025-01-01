import { FormControl, RadioGroup } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { ColorSchemeContainer } from './index.styles';
import useColorSchemeSelector from './useColorSchemeSelector';

const ColorSchemeSwitcher = () => {
  const { t } = useAppTranslation();

  const { colorScheme, handleChangeColor } = useColorSchemeSelector();

  return (
    <FormControl>
      <RadioGroup
        row
        name="app-color-scheme"
        value={colorScheme}
        onChange={handleChangeColor}
        sx={{
          display: 'flex',
          gap: '24px',
          '@media (max-width: 500px)': {
            display: 'grid',
            gridTemplateColumns: '50% 50%',
            gridColumnGap: '0',
          },
        }}
      >
        <ColorSchemeContainer
          value="blue"
          selected={colorScheme}
          label={t('tr_blue')}
        />
        <ColorSchemeContainer
          value="green"
          selected={colorScheme}
          label={t('tr_green')}
        />
        <ColorSchemeContainer
          value="purple"
          selected={colorScheme}
          label={t('tr_purple')}
        />
        <ColorSchemeContainer
          value="orange"
          selected={colorScheme}
          label={t('tr_orange')}
        />
      </RadioGroup>
    </FormControl>
  );
};

export default ColorSchemeSwitcher;
