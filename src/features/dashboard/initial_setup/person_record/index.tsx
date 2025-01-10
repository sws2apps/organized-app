import { Box, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { PersonRecordProps } from './index.types';
import usePersonRecord from './usePersonRecord';
import Button from '@components/button';
import TextField from '@components/textfield';
import Typography from '@components/typography';
import WaitingLoader from '@components/waiting_loader';

const PersonRecord = ({ onPrevious }: PersonRecordProps) => {
  const { t } = useAppTranslation();

  const { tabletDown } = useBreakpoints();

  const {
    handleSavePerson,
    firstname,
    handleFirstnameChange,
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
          flexWrap: tabletDown ? 'wrap' : 'nowrap',
          justifyContent: 'space-between',
          flexDirection: 'row',
        }}
      >
        <TextField
          label={t('tr_firstname')}
          height={48}
          value={firstname}
          onChange={(e) => handleFirstnameChange(e.target.value)}
        />
        <TextField
          label={t('tr_lastname')}
          height={48}
          value={lastname}
          onChange={(e) => handleLastnameChange(e.target.value)}
        />
      </Box>

      <Stack spacing="8px">
        <Button
          variant="main"
          onClick={handleSavePerson}
          endIcon={
            isProcessing && <WaitingLoader size={22} variant="standard" />
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
