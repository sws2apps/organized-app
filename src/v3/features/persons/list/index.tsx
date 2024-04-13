import { Box } from '@mui/material';
import PersonsListAll from './components/all_persons';
import Tabs from '@components/tabs';
import Typography from '@components/typography';
import useList from './useList';
import { useAppTranslation } from '@hooks/index';

const PersonsList = () => {
  const { t } = useAppTranslation();

  const { persons } = useList();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
      <Typography className="h2">{t('tr_personsAmount', { amount: persons.length })}</Typography>

      <Tabs
        tabs={[
          {
            label: t('tr_personsAll'),
            Component: <PersonsListAll />,
          },
          {
            label: t('tr_recentlyViewed'),
            Component: <></>,
          },
        ]}
      />
    </Box>
  );
};

export default PersonsList;
