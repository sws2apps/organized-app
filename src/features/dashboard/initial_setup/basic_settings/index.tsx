import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { BasicSettingsProps } from './index.types';
import useBasicSettings from './useBasicSettings';
import Button from '@components/button';
import DateFormat from '@features/congregation/settings/meeting_forms/date_format';
import DataSharing from '@features/congregation/settings/congregation_privacy/data_sharing';
import HourFormat from '@features/congregation/settings/congregation_basic/hour_format';
import NameFormat from '@features/congregation/settings/meeting_forms/name_format';
import Typography from '@components/typography';

const BasicSettings = (props: BasicSettingsProps) => {
  const { t } = useAppTranslation();

  const { handleSave } = useBasicSettings(props);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Typography color="var(--grey-400)">
        {t('tr_initialOrganizedSetupDescStep_1')}
      </Typography>

      <DataSharing />

      <HourFormat />

      <Stack spacing="24px" marginTop="12px">
        <DateFormat />

        <NameFormat />
      </Stack>

      <Stack spacing="8px">
        <Button variant="main" onClick={handleSave}>
          {t('tr_saveAndContinueBtn')}
        </Button>
        <Button variant="secondary" onClick={props.onMove}>
          {t('tr_skipThisStepBtn')}
        </Button>
      </Stack>
    </Box>
  );
};

export default BasicSettings;
