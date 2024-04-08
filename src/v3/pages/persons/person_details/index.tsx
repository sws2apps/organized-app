import { Box } from '@mui/material';
import { Button, PageTitle } from '@components/index';
import { IconSave } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { PersonBasicInfo, PersonSpiritualStatus } from '@features/index';
import usePersonDetails from './usePersonDetails';

const PersonDetails = () => {
  const { t } = useAppTranslation();

  const { isNewPerson } = usePersonDetails();

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
          flexWrap: 'wrap',
          maxWidth: '590px',
          flexDirection: 'column',
        }}
      >
        <PersonBasicInfo />
        <PersonSpiritualStatus />
      </Box>
    </Box>
  );
};

export default PersonDetails;
