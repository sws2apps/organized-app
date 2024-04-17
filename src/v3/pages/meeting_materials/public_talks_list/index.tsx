import { Box } from '@mui/material';
import { IconListView, IconSpreadsheet } from '@components/icons';
import Button from '@components/button';
import PageTitle from '@components/page_title';
import usePublicTalksList from './usePublicTalksList';
import { useAppTranslation } from '@hooks/index';
import { PublicTalks } from '@features/index';

const PublicTalksList = () => {
  const { t } = useAppTranslation();

  const { currentView, handleToggleView } = usePublicTalksList();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle
        title={t('tr_publicTalksList')}
        backTo="/"
        buttons={
          <Button
            variant="secondary"
            startIcon={
              currentView === 'list' ? (
                <IconSpreadsheet height={22} width={22} color="var(--accent-main)" />
              ) : (
                <IconListView height={22} width={22} color="var(--accent-main)" />
              )
            }
            onClick={handleToggleView}
          >
            {currentView === 'list' ? t('tr_tableView') : t('tr_listView')}
          </Button>
        }
      />

      <PublicTalks view={currentView} />
    </Box>
  );
};

export default PublicTalksList;
