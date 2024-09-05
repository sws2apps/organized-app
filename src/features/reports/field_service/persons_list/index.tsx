import { Box, Stack } from '@mui/material';
import { IconGenerate } from '@components/icons';
import { isDEV, isDemo } from '@constants/index';
import { useAppTranslation } from '@hooks/index';
import usePersonsList from './usePersonsList';
import Button from '@components/button';
import Card from '@components/card';
import NoSearchResults from '@assets/img/illustration_no_search_results.svg?component';
import PersonItem from './person_item';
import Typography from '@components/typography';

const PersonsList = () => {
  const { t } = useAppTranslation();

  const { persons, handleAddRandomData, report_editable } = usePersonsList();

  return (
    <Card>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography className="h3">
          {t('tr_personsAmount', { amount: persons.length })}
        </Typography>

        {report_editable && (isDEV || isDemo) && (
          <Button
            variant="small"
            startIcon={<IconGenerate />}
            onClick={handleAddRandomData}
            sx={{ minHeight: '32px', height: '32px' }}
          >
            Random data
          </Button>
        )}
      </Box>

      {persons.length === 0 && (
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
      )}

      {persons.length > 0 && (
        <Stack spacing="8px">
          {persons.map((person) => (
            <PersonItem key={person.person_uid} person={person} />
          ))}
        </Stack>
      )}
    </Card>
  );
};

export default PersonsList;
