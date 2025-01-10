import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import PersonsListAll from './all_persons';
import PersonsRecent from './recent_persons';
import PersonsEmpty from './persons_empty';
import Tabs from '@components/tabs';
import Typography from '@components/typography';
import useList from './useList';

const PersonsList = () => {
  const { t } = useAppTranslation();

  const { persons, activeTab, handleTabChange, personsAll } = useList();

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

      {personsAll.length === 0 && <PersonsEmpty />}

      {personsAll.length > 0 && (
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          sx={{
            '& .MuiButtonBase-root': {
              borderRadius: 'var(--radius-l)',
            },
          }}
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
