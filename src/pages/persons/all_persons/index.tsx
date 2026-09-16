import { Box } from '@mui/material';
import { Button, PageTitle } from '@components/index';
import {
  IconAddPerson,
  IconImportExport,
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
import NavBarButton from '@components/nav_bar_button';
import NavBarButtonGroup from '@components/nav_bar_button_group';
import ImportExport from '@features/persons/import_export';
import PaneSwitcher from '@components/pane_switcher';

const PersonsAll = () => {
  const { t } = useAppTranslation();

  const { desktopUp, tablet688Up } = useBreakpoints();

  const { isPersonEditor } = useCurrentUser();

  const {
    handlePersonAdd,
    isPanelOpen,
    setIsPanelOpen,
    handleOpenExchange,
    isDataExchangeOpen,
    handleCloseExchange,
  } = useAllPersons();

  const listCardStyles = {
    backgroundColor: 'var(--white)',
    border: '1px solid var(--accent-300)',
    flex: 1,
    borderRadius: 'var(--radius-xl)',
    padding: '16px',
    display: 'flex',
    gap: '16px',
    flexDirection: 'column',
  };

  const filterCardStyles = {
    backgroundColor: 'var(--white)',
    border: '1px solid var(--accent-300)',
    borderRadius: 'var(--radius-xl)',
    padding: '16px',
    width: '100%',
  };

  const listPane = (
    <>
      <Box sx={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <PersonsSearch />
        </Box>
        <Button
          variant="secondary"
          disableAutoStretch
          sx={{ flexShrink: 0, height: '48px', padding: '8px 16px' }}
          onClick={() => setIsPanelOpen((prev) => !prev)}
          endIcon={isPanelOpen ? <IconPanelOpen /> : <IconPanelClose />}
        >
          {t('tr_filters')}
        </Button>
      </Box>

      <PersonsList />
    </>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        paddingBottom: !tablet688Up ? '60px' : '0px',
      }}
    >
      <PageTitle
        title={t('tr_personsAll')}
        buttons={
          isPersonEditor && (
            <NavBarButtonGroup>
              <NavBarButton
                text={t('tr_importExport')}
                icon={<IconImportExport />}
                onClick={handleOpenExchange}
              ></NavBarButton>
              <NavBarButton
                text={t('tr_btnAdd')}
                icon={<IconAddPerson />}
                onClick={handlePersonAdd}
              ></NavBarButton>
            </NavBarButtonGroup>
          )
        }
      />

      <ImportExport
        key={isDataExchangeOpen ? 'open' : 'closed'}
        open={isDataExchangeOpen}
        onClose={handleCloseExchange}
      />
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-start',
        }}
      >
        {desktopUp && <Box sx={listCardStyles}>{listPane}</Box>}

        {!desktopUp && (
          <PaneSwitcher
            fullBleed
            value={isPanelOpen ? 1 : 0}
            panes={[
              {
                key: 'list',
                content: <Box sx={listCardStyles}>{listPane}</Box>,
              },
              {
                key: 'filter',
                content: (
                  <Box sx={filterCardStyles}>
                    <PersonsFilter />
                  </Box>
                ),
              },
            ]}
          />
        )}

        {desktopUp && isPanelOpen && (
          <Box sx={{ ...filterCardStyles, width: '520px' }}>
            <PersonsFilter />
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PersonsAll;
