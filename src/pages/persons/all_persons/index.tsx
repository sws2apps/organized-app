import { Badge, Box } from '@mui/material';
import { Button, PageTitle } from '@components/index';
import {
  IconAddPerson,
  IconDownload,
  IconPanelClose,
  IconPanelOpen,
} from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { PersonsFilter, PersonsList, PersonsSearch } from '@features/index';
import { isDemo } from '@constants/index';
import useAllPersons from './useAllPersons';
import { useState } from 'react';

const PersonsAll = () => {
  const { t } = useAppTranslation();

  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const { handlePersonAdd, handleGetDummyPersons } = useAllPersons();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle
        title={t('tr_personsAll')}
        buttons={
          <>
            {!isDemo && (
              <Button
                variant="main"
                startIcon={<IconDownload />}
                onClick={handleGetDummyPersons}
              >
                GET DUMMY
                <Badge
                  badgeContent={'dev'}
                  color="error"
                  sx={{ marginTop: '-35px', left: 18, position: 'absolute' }}
                />
              </Button>
            )}

            <Button
              variant="main"
              startIcon={<IconAddPerson />}
              onClick={handlePersonAdd}
            >
              {t('tr_personAdd')}
            </Button>
          </>
        }
      />

      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-start',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'var(--white)',
            border: '1px solid var(--accent-300)',
            flexGrow: 1,
            borderRadius: 'var(--radius-xl)',
            padding: '16px',
            display: 'flex',
            gap: '16px',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ display: 'flex', gap: '16px' }}>
            <PersonsSearch />
            <Button
              variant="secondary"
              onClick={() => setIsPanelOpen(!isPanelOpen)}
              endIcon={isPanelOpen ? <IconPanelOpen /> : <IconPanelClose />}
            >
              {t('tr_filters')}
            </Button>
          </Box>

          <PersonsList />
        </Box>

        {isPanelOpen && (
          <Box
            sx={(theme) => ({
              backgroundColor: 'var(--white)',
              border: '1px solid var(--accent-300)',
              borderRadius: 'var(--radius-xl)',
              padding: '16px',
              [theme.breakpoints.up(900)]: {
                minWidth: '300px',
                maxWidth: '300px',
              },
              [theme.breakpoints.up(1100)]: {
                minWidth: '400px',
                maxWidth: '400px',
              },
              [theme.breakpoints.up(1400)]: {
                minWidth: '580px',
                maxWidth: '580px',
              },
            })}
          >
            <PersonsFilter />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PersonsAll;
