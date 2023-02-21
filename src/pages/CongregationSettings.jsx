import Box from '@mui/material/Box';
import { BasicSettings, DataStorage, SourcesFormsSettings } from '../features/settings';

const sharedStyles = {
  settingItem: {
    margin: '10px 2px',
    padding: '5px',
  },
};

const CongregationSettings = () => {
  return (
    <Box>
      <Box sx={sharedStyles.settingItem}>
        <SourcesFormsSettings />
      </Box>

      <Box sx={sharedStyles.settingItem}>
        <BasicSettings />
      </Box>

      <Box sx={sharedStyles.settingItem}>
        <DataStorage />
      </Box>
    </Box>
  );
};

export default CongregationSettings;
