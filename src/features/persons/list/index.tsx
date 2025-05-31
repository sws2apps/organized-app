import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useList from './useList';
import PersonsListAll from './all_persons';
import PersonsRecent from './recent_persons';
import PersonsEmpty from './persons_empty';
import Tabs from '@components/tabs';
import Typography from '@components/typography';

const PersonsList = () => {
  const { t } = useAppTranslation();

  const { persons, activeTab, handleTabChange, personsByView } = useList();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginTop: '16px',
      }}
    >
      <Typography className="h2">
        {t('tr_personsAmount', { amount: persons.length })}
      </Typography>

      {personsByView.length === 0 && <PersonsEmpty />}

      {personsByView.length > 0 && (
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          tabs={[
            {
              label: t('tr_personsAll'),
              Component: <PersonsListAll />,
            },
            {
              label: t('tr_recentlyViewed'),
              Component: <PersonsRecent />,
            },
          ]}
        />
      )}
    </Box>
  );
};

export default PersonsList;
