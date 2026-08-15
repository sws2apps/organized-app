import { useAppTranslation, useCurrentUser } from '@hooks/index';
import {
  CardSection,
  CardSectionContent,
  CardSectionHeader,
} from '../shared_styles';
import useCircuitOverseer from './useCircuitOverseer';
import TextField from '@components/textfield';
import WeeksList from './weeks_list';
import { Box, Stack } from '@mui/material';

const CircuitOverseer = () => {
  const { t } = useAppTranslation();

  const { isAdmin } = useCurrentUser();

  const {
    displayNameEnabled,
    displayname,
    firstname,
    handleDisplaynameChange,
    handleDisplaynameSave,
    handleFirstnameChange,
    handleFirstnameSave,
    handleMiddlenameChange,
    handleMiddlenameSave,
    middlename,
    handleLastnameChange,
    handleLastnameSave,
    lastname,
  } = useCircuitOverseer();

  return (
    <CardSection>
      <CardSectionHeader
        title={t('tr_circuitOverseer')}
        description={t('tr_circuitOverseerSettingDesc')}
      />

      <CardSectionContent>
        <Stack spacing="16px">
          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <TextField
              type="text"
              label={t('tr_firstname')}
              value={firstname}
              onChange={(e) => handleFirstnameChange(e.target.value)}
              onKeyUp={handleFirstnameSave}
              slotProps={{ input: { readOnly: !isAdmin } }}
              sx={{ flex: '1 0 200px' }}
            />
            <TextField
              type="text"
              label={t('tr_middlename')}
              value={middlename}
              onChange={(e) => handleMiddlenameChange(e.target.value)}
              onKeyUp={handleMiddlenameSave}
              slotProps={{ input: { readOnly: !isAdmin } }}
              sx={{ flex: '1 0 200px' }}
            />
            <TextField
              type="text"
              label={t('tr_lastname')}
              value={lastname}
              onChange={(e) => handleLastnameChange(e.target.value)}
              onKeyUp={handleLastnameSave}
              slotProps={{ input: { readOnly: !isAdmin } }}
              sx={{ flex: '1 0 200px' }}
            />
          </Box>

          {displayNameEnabled && (
            <TextField
              type="text"
              label={t('tr_displayName')}
              value={displayname}
              onChange={(e) => handleDisplaynameChange(e.target.value)}
              onKeyUp={handleDisplaynameSave}
              slotProps={{ input: { readOnly: !isAdmin } }}
            />
          )}

          <WeeksList />
        </Stack>
      </CardSectionContent>
    </CardSection>
  );
};

export default CircuitOverseer;
