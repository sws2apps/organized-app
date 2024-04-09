import { Box } from '@mui/material';
import { Button, PageTitle } from '@components/index';
import { IconAddPerson } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { PersonsFilter, PersonsSearch } from '@features/index';

const PersonsAll = () => {
  const { t } = useAppTranslation();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle
        title={t('tr_personsAll')}
        backTo="/"
        buttons={
          <Button variant="main" startIcon={<IconAddPerson />}>
            {t('tr_personAdd')}
          </Button>
        }
      />

      <Box
        sx={{
          backgroundColor: 'var(--white)',
          border: '1px solid var(--accent-300)',
          borderRadius: 'var(--radius-xl)',
          padding: '16px',
          display: 'flex',
          gap: '16px',
          flexDirection: 'column',
        }}
      >
        <PersonsSearch />
        <PersonsFilter />
      </Box>
    </Box>
  );
};

export default PersonsAll;
