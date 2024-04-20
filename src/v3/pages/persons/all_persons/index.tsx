import { Badge, Box } from '@mui/material';
import { Button, PageTitle } from '@components/index';
import { IconAddPerson, IconDownload } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { PersonsFilter, PersonsList, PersonsSearch } from '@features/index';
import useAllPersons from './useAllPersons';
import { isDEV, isQA } from '@constants/index';

const PersonsAll = () => {
  const { t } = useAppTranslation();

  const { handlePersonAdd, handleGetDummyPersons } = useAllPersons();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle
        title={t('tr_personsAll')}
        buttons={
          <>
            {(isDEV || isQA) && (
              <Button variant="main" startIcon={<IconDownload />} onClick={handleGetDummyPersons}>
                GET DUMMY
                <Badge badgeContent={'dev'} color="error" sx={{ marginTop: '-35px', left: 18, position: 'absolute' }} />
              </Button>
            )}

            <Button variant="main" startIcon={<IconAddPerson />} onClick={handlePersonAdd}>
              {t('tr_personAdd')}
            </Button>
          </>
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

        <PersonsList />
      </Box>
    </Box>
  );
};

export default PersonsAll;
