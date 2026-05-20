import { FullnameOption } from '@definition/settings';
import {
  useAppTranslation,
  useCurrentUser,
} from '@hooks/index';
import {
  CardSection,
  CardSectionContent,
  CardSectionHeader,
  TwoColumnsRow,
} from '../shared_styles';
import useCircuitOverseer from './useCircuitOverseer';
import TextField from '@components/textfield';
import WeeksList from './weeks_list';
import { Stack } from '@mui/material';

const CircuitOverseer = () => {
  const { t } = useAppTranslation();

  const { isAdmin } = useCurrentUser();

  const {
    fullnameOption,
    displayNameEnabled,
    displayname,
    firstname,
    handleDisplaynameChange,
    handleDisplaynameSave,
    handleFirstnameChange,
    handleFirstnameSave,
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

        <CardSectionContent sx={{ '& > hr': { display: 'none' } }}>
          <Stack spacing="16px">
            <TwoColumnsRow
              sx={{
                flexDirection:
                  fullnameOption === FullnameOption.FIRST_BEFORE_LAST
                    ? 'row'
                    : 'row-reverse',
              }}
            >
              <TextField
                type="text"
                label={t('tr_firstname')}
                value={firstname}
                onChange={(e) => handleFirstnameChange(e.target.value)}
                onKeyUp={handleFirstnameSave}
                slotProps={{ input: { readOnly: !isAdmin } }}
              />
              <TextField
                type="text"
                label={t('tr_lastname')}
                value={lastname}
                onChange={(e) => handleLastnameChange(e.target.value)}
                onKeyUp={handleLastnameSave}
                slotProps={{ input: { readOnly: !isAdmin } }}
              />
            </TwoColumnsRow>

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
