import { Box } from '@mui/material';
import { IconExport, IconListView, IconSpreadsheet } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import usePublicTalksList from './usePublicTalksList';
import Button from '@components/button';
import PageTitle from '@components/page_title';
import PublicTalks from '@features/meeting_materials/public_talks';

const PublicTalksList = () => {
  const { t } = useAppTranslation();
  const { laptopUp } = useBreakpoints();

  const { currentView, handleToggleView } = usePublicTalksList();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle
        title={t('tr_publicTalksList')}
        buttons={
          <>
            <Button
              variant="secondary"
              startIcon={
                currentView === 'list' ? (
                  <IconSpreadsheet
                    height={22}
                    width={22}
                    color="var(--accent-main)"
                  />
                ) : (
                  <IconListView
                    height={22}
                    width={22}
                    color="var(--accent-main)"
                  />
                )
              }
              onClick={handleToggleView}
            >
              {currentView === 'list' ? t('tr_tableView') : t('tr_listView')}
            </Button>
            {currentView === 'table' && laptopUp && (
              <Button
                variant="main"
                startIcon={
                  <IconExport
                    height={22}
                    width={22}
                    color="var(--accent-dark)"
                  />
                }
              >
                {t('tr_exportS99')}
              </Button>
            )}
          </>
        }
      />

      <PublicTalks view={currentView} />
    </Box>
  );
};

export default PublicTalksList;
