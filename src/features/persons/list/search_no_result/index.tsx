import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import Typography from '@components/typography';
import NoSearchResults from '@assets/img/illustration_no_search_results.svg?component';

const PersonsSearchNoResult = () => {
  const { t } = useAppTranslation();

  return (
    <Box
      sx={{
        padding: '48px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '800px',
        margin: 'auto',
        gap: '32px',
      }}
    >
      <NoSearchResults
        viewBox="0 0 160 160"
        style={{ width: '128px', height: '128px' }}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Typography className="h2">{t('tr_searchResultsNone')}</Typography>
        <Typography color="var(--grey-400)">
          {t('tr_searchResultsNoneDesc')}
        </Typography>
      </Box>
    </Box>
  );
};

export default PersonsSearchNoResult;
