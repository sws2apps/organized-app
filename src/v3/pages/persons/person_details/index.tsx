import { Box } from '@mui/material';
import { Button, PageTitle } from '@components/index';
import { IconSave } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import {
  PersonAssignment,
  PersonBasicInfo,
  PersonEmergencyContacts,
  PersonEnrollments,
  PersonPrivileges,
  PersonSpiritualStatus,
  PersonTimeAway,
} from '@features/index';
import usePersonDetails from './usePersonDetails';

const PersonDetails = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const { isNewPerson, isBaptized, isMale } = usePersonDetails();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle
        title={isNewPerson ? t('tr_addNewPerson') : t('tr_editPerson')}
        backTo="/persons"
        buttons={
          <Button variant="main" startIcon={<IconSave />}>
            {t('tr_save')}
          </Button>
        }
      />

      <Box
        sx={{
          borderRadius: 'var(--radius-xl)',
          display: 'flex',
          gap: '16px',
          flexDirection: desktopUp ? 'row' : 'column',
          alignItems: 'flex-start',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            flexDirection: 'column',
            flex: 1,
            width: desktopUp ? 'auto' : '100%',
          }}
        >
          <PersonBasicInfo />
          <PersonSpiritualStatus />

          {isBaptized && (
            <Box
              sx={{
                backgroundColor: 'var(--white)',
                border: '1px solid var(--accent-300)',
                display: 'flex',
                padding: '16px',
                gap: '16px',
                flexDirection: 'column',
                borderRadius: 'var(--radius-xl)',
                flex: 1,
                width: '100%',
              }}
            >
              {isMale && <PersonPrivileges />}

              <PersonEnrollments />
            </Box>
          )}
        </Box>

        <Box sx={{ flex: 1, display: 'flex', gap: '16px', flexDirection: 'column' }}>
          <PersonAssignment />
          <PersonTimeAway />
          <PersonEmergencyContacts />
        </Box>
      </Box>
    </Box>
  );
};

export default PersonDetails;
