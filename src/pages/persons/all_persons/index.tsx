/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Slide } from '@mui/material';
import { Button, PageTitle } from '@components/index';
import {
  IconAddPerson,
  IconPanelClose,
  IconPanelOpen,
} from '@components/icons';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import useAllPersons from './useAllPersons';
import PersonsList from '@features/persons/list';
import PersonsFilter from '@features/persons/filter';
import PersonsSearch from '@features/persons/search';

const PersonsAll = () => {
  const { t } = useAppTranslation();

  const { desktopUp, tablet500Down } = useBreakpoints();

  const { isPersonEditor } = useCurrentUser();

  const { handlePersonAdd, isPanelOpen, setIsPanelOpen } = useAllPersons();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle
        title={t('tr_personsAll')}
        buttons={
          <>
            {isPersonEditor && (
              <Button
                variant="main"
                startIcon={<IconAddPerson />}
                onClick={handlePersonAdd}
              >
                {t('tr_personAdd')}
              </Button>
            )}
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
        {desktopUp && (
          <Box
            sx={{
              backgroundColor: 'var(--white)',
              border: '1px solid var(--accent-300)',
              flex: 1,
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
                onClick={() => setIsPanelOpen((prev) => !prev)}
                endIcon={isPanelOpen ? <IconPanelOpen /> : <IconPanelClose />}
              >
                {t('tr_filters')}
              </Button>
            </Box>

            <PersonsList />
          </Box>
        )}

        {!desktopUp && (
          <Box sx={{ position: 'relative', overflowX: 'clip', width: '100%' }}>
            <Slide direction="right" in={!isPanelOpen} unmountOnExit>
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  paddingBottom: '32px',
                }}
              >
                <Box
                  sx={{
                    backgroundColor: 'var(--white)',
                    border: '1px solid var(--accent-300)',
                    flex: 1,
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
                      sx={tablet500Down && { width: '35%' }}
                      onClick={() => setIsPanelOpen((prev) => !prev)}
                      endIcon={
                        isPanelOpen ? <IconPanelOpen /> : <IconPanelClose />
                      }
                    >
                      {t('tr_filters')}
                    </Button>
                  </Box>

                  <PersonsList />
                </Box>
              </Box>
            </Slide>

            <Slide direction="left" in={isPanelOpen} unmountOnExit>
              <Box
                sx={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  paddingBottom: '32px',
                }}
              >
                <Box
                  sx={{
                    backgroundColor: 'var(--white)',
                    border: '1px solid var(--accent-300)',
                    borderRadius: 'var(--radius-xl)',
                    padding: '16px',
                    width: '100%',
                  }}
                >
                  <PersonsFilter />
                </Box>
              </Box>
            </Slide>
          </Box>
        )}

        {desktopUp && isPanelOpen && (
          <Box
            sx={{
              backgroundColor: 'var(--white)',
              border: '1px solid var(--accent-300)',
              borderRadius: 'var(--radius-xl)',
              padding: '16px',
              width: '520px',
            }}
          >
            <PersonsFilter />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PersonsAll;
