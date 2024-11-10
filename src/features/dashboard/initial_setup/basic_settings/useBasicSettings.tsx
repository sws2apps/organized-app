import { BasicSettingsProps } from './index.types';

const useBasicSettings = ({ onMove }: BasicSettingsProps) => {
  const handleSave = () => {
    onMove();
  };

  return { handleSave };
};

export default useBasicSettings;
