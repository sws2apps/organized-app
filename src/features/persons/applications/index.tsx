import { useAppTranslation } from '@hooks/index';
import useApplications from './useApplications';
import Card from '@components/card';
import SearchBar from '@components/search_bar';
import Typography from '@components/typography';
import ScrollableTabs from '@components/scrollable_tabs';
import { Box } from '@mui/material';

const PersonApplications = () => {
  const { t } = useAppTranslation();

  const {
    AP_count,
    handleSearchChange,
    search,
    tabs,
    currentTab,
    handleTabChange,
  } = useApplications();

  return (
    <Card>
      <SearchBar
        placeholder={t('tr_searchByName')}
        value={search}
        onSearch={handleSearchChange}
      />

      <Typography className="h2">
        {t('tr_applicationsAmount', { amount: AP_count })}
      </Typography>

      <Box sx={{ marginBottom: '-24px' }}>
        <ScrollableTabs
          indicatorMode
          tabs={tabs}
          value={currentTab}
          onChange={handleTabChange}
          sx={{
            '& button.Mui-selected': {
              color: 'var(--accent-main)',
              background: 'unset',
              borderRadius: 'unset',
            },
            '& span.MuiTouchRipple-root': { borderRadius: 'unset' },
          }}
        />
      </Box>
    </Card>
  );
};

export default PersonApplications;
