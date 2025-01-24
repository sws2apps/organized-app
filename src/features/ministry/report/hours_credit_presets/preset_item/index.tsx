import { Stack } from '@mui/material';
import { PresetItemProps } from './index.types';
import { useAppTranslation } from '@hooks/index';
import usePresetItem from './usePresetItem';
import MenuItem from '@components/menuitem';
import Typography from '@components/typography';

const PresetItem = (props: PresetItemProps) => {
  const { t } = useAppTranslation();

  const { preset, handleSelectPreset } = usePresetItem(props);

  return (
    <MenuItem
      sx={{ gap: '8px', minHeight: '56px' }}
      onClick={(e) => {
        e.currentTarget.blur();
        handleSelectPreset();
      }}
    >
      {preset.icon}
      <Stack>
        <Typography>{preset.name}</Typography>
        <Typography className="body-small-regular" color="var(--grey-400)">
          {t('tr_hoursList', { Hours: preset.value })}
        </Typography>
      </Stack>
    </MenuItem>
  );
};

export default PresetItem;
