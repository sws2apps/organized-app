import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import Card from '@components/card';
import NoSearchResults from '@assets/img/illustration_no_search_results.svg?component';
import Typography from '@components/typography';

const PersonsList = () => {
  const { t } = useAppTranslation();

  return (
    <Card>
      <Stack spacing="16px">
        <Typography className="h3">
          {t('tr_personsAmount', { amount: 0 })}
        </Typography>
      </Stack>

      <Box sx={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <Box>
          <NoSearchResults viewBox="0 0 160 160" width={80} height={80} />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Typography className="h4">{t('tr_searchResultsNone')}</Typography>
          <Typography color="var(--grey-400)">
            {t('tr_searchResultsNoneDesc')}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
};

export default PersonsList;
