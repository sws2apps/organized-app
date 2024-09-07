import { PresetItemProps } from './index.types';

const usePresetItem = ({ onClose, preset, onSelect }: PresetItemProps) => {
  const handleSelectPreset = async () => {
    onSelect(preset.value, preset.name);

    onClose();
  };

  return { handleSelectPreset, preset };
};

export default usePresetItem;
