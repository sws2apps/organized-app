import { Box } from '@mui/material';
import Button from '@components/button';
import PageTitle from '@components/page_title';
import TextMarkup from '@components/text_markup';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import { IconNoConnection, IconSync } from '@components/icons';
import usePublicTalksList from './usePublicTalksList';

const PublicTalksList = () => {
  const { t } = useAppTranslation();

  const { isConnected } = usePublicTalksList();

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle
        title={t('tr_publicTalksList')}
        backTo="/"
        buttons={
          isConnected ? (
            <Button
              variant="main"
              startIcon={<IconSync height={22} width={22} color="var(--always-white)" />}
              onClick={null}
            >
              {t('tr_syncTalksList')}
            </Button>
          ) : null
        }
      />

      {!isConnected && (
        <Box
          sx={{
            height: 'calc(100vh - 160px)',
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
    </Box>
  );
};

export default PublicTalksList;
