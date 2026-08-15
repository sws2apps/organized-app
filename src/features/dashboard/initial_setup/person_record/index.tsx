import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { PersonRecordProps } from './index.types';
import usePersonRecord from './usePersonRecord';
import Button from '@components/button';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import IconLoading from '@components/icon_loading';

const PersonRecord = ({ onPrevious }: PersonRecordProps) => {
  const { t } = useAppTranslation();

  const {
    handleSavePerson,
    firstname,
    handleFirstnameChange,
    middlename,
    handleMiddlenameChange,
    handleLastnameChange,
    lastname,
    isProcessing,
  } = usePersonRecord();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <Typography color="var(--grey-400)">
        {t('tr_initialOrganizedSetupDescStep_2')}
      </Typography>

      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          flexWrap: 'wrap',
        }}
      >
        <TextField
          label={t('tr_firstname')}
          height={48}
          value={firstname}
          onChange={(e) => handleFirstnameChange(e.target.value)}
          sx={{ flex: '1 0 200px' }}
        />
        <TextField
          label={t('tr_middlename')}
          height={48}
          value={middlename}
          onChange={(e) => handleMiddlenameChange(e.target.value)}
          sx={{ flex: '1 0 200px' }}
        />
        <TextField
          label={t('tr_lastname')}
          height={48}
          value={lastname}
          onChange={(e) => handleLastnameChange(e.target.value)}
          sx={{ flex: '1 0 200px' }}
        />
      </Box>

      <Stack spacing="8px">
        <Button
          variant="main"
          onClick={handleSavePerson}
          startIcon={
            isProcessing && (
              <IconLoading width={22} height={22} color="var(--always-white)" />
            )
          }
        >
          {t('tr_done')}
        </Button>
        <Button
          variant="secondary"
          disabled={isProcessing}
          onClick={onPrevious}
        >
          {t('tr_back')}
        </Button>
      </Stack>
    </Box>
  );
};

export default PersonRecord;
