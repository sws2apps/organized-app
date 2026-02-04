import { Box } from '@mui/material';
import { IconListView, IconSpreadsheet } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import usePublicTalksList from './usePublicTalksList';
import PageTitle from '@components/page_title';
import PublicTalks from '@features/meeting_materials/public_talks';
import NavBarButton from '@components/nav_bar_button';

const PublicTalksList = () => {
  const { t } = useAppTranslation();
  const { tablet688Up } = useBreakpoints();

  const { currentView, handleToggleView } = usePublicTalksList();

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
        title={t('tr_publicTalksList')}
        buttons={
          <NavBarButton
            main
            text={currentView === 'list' ? t('tr_tableView') : t('tr_listView')}
            icon={
              currentView === 'list' ? (
                <IconSpreadsheet height={22} width={22} />
              ) : (
                <IconListView height={22} width={22} />
              )
            }
            onClick={handleToggleView}
          ></NavBarButton>
        }
      />

      <PublicTalks view={currentView} />
    </Box>
  );
};

export default PublicTalksList;
