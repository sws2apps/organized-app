import { IconAdd } from '@components/icons';
import NavBarButton from '@components/nav_bar_button';
import NavBarButtonGroup from '@components/nav_bar_button_group';
import PageTitle from '@components/page_title';
import CategorySelector from '@features/congregation/information_board/category_selector';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import { Box } from '@mui/material';
import useInformationBoard from './userInformationBoard';
import QuickSettingsInformationBoard from '@features/congregation/information_board/quick_settings';
import AddAnnouncement from '@features/congregation/information_board/add_announcement';

const InformationBoard = () => {
  const { t } = useAppTranslation();

  const { tablet688Up, desktopUp } = useBreakpoints();
  const { isAdmin } = useCurrentUser();

  const {
    currentCategory,
    quickSettingsOpen,
    addAnnouncementOpen,
    handleOpenQuickSettings,
    handleCloseQuickSettings,
    handleOpenAddAnnouncement,
    handleCloseAddAnnouncement,
  } = useInformationBoard();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',
        paddingBottom: !tablet688Up ? '60px' : '0px',
      }}
    >
      {quickSettingsOpen && (
        <QuickSettingsInformationBoard
          open={quickSettingsOpen}
          onClose={handleCloseQuickSettings}
        />
      )}

      {addAnnouncementOpen && (
        <AddAnnouncement
          open={addAnnouncementOpen}
          onClose={handleCloseAddAnnouncement}
        />
      )}

      <PageTitle
        title={t('tr_informationBoard')}
        quickSettings={handleOpenQuickSettings}
        buttons={
          isAdmin && (
            <NavBarButtonGroup>
              <NavBarButton
                text={t('tr_add')}
                icon={<IconAdd />}
                onClick={handleOpenAddAnnouncement}
              ></NavBarButton>
            </NavBarButtonGroup>
          )
        }
      />
      <Box
        sx={{
          display: 'flex',
          flexDirection: desktopUp ? 'row' : 'column',
          gap: '16px',
          alignItems: desktopUp ? 'flex-start' : 'unset',
        }}
      >
        <CategorySelector />
        {currentCategory}
      </Box>
    </Box>
  );
};

export default InformationBoard;
