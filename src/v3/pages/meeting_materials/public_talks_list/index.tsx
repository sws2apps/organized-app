import { Box } from '@mui/material';
import { IconInfo, IconListView, IconNoConnection, IconSpreadsheet, IconSync } from '@components/icons';
import Button from '@components/button';
import InfoTip from '@components/info_tip';
import PageTitle from '@components/page_title';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';
import WaitingCircular from '@components/waiting_circular';
import usePublicTalksList from './usePublicTalksList';
import { useAppTranslation } from '@hooks/index';
import { PublicTalks } from '@features/index';

const PublicTalksList = () => {
  const { t } = useAppTranslation();

  const { isConnected, talksList, handleSyncTalks, isFetching, currentView, handleToggleView } = usePublicTalksList();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle
        title={t('tr_publicTalksList')}
        backTo="/"
        buttons={
          isConnected || talksList.length > 0 ? (
            <>
              {talksList.length > 0 && (
                <Button
                  variant="secondary"
                  startIcon={
                    currentView === 'list' ? (
                      <IconSpreadsheet height={22} width={22} color="var(--accent-main)" />
                    ) : (
                      <IconListView height={22} width={22} color="var(--accent-main)" />
                    )
                  }
                  disabled={isFetching}
                  onClick={handleToggleView}
                >
                  {currentView === 'list' ? t('tr_tableView') : t('tr_listView')}
                </Button>
              )}

              {isConnected && (
                <Button
                  variant="main"
                  startIcon={<IconSync height={22} width={22} color="var(--always-white)" />}
                  onClick={handleSyncTalks}
                  disabled={isFetching}
                >
                  {t('tr_syncTalksList')}
                </Button>
              )}
            </>
          ) : null
        }
      />

      {isFetching && <WaitingCircular />}

      {!isFetching && (
        <>
          {isConnected && talksList.length === 0 && (
            <InfoTip
              isBig={false}
              text={t('tr_noTalksList')}
              icon={<IconInfo />}
              color="white"
              sx={{ maxWidth: '700px' }}
            />
          )}

          {talksList.length > 0 && <PublicTalks view={currentView} />}

          {!isConnected && talksList.length === 0 && (
            <Box
              sx={{
                height: 'calc(100vh - 200px)',
                display: 'flex',

                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box sx={{ maxWidth: '702px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                <IconNoConnection height={74} width={74} color="var(--red-main)" />
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <Typography className="h1">{t('tr_offline')}</Typography>
                  <TextMarkup
                    content={t('tr_publicTalkOfflineDesc')}
                    className="h4"
                    color="var(--grey-400)"
                    anchorClassName="body-regular"
                  />
                </Box>
              </Box>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default PublicTalksList;
