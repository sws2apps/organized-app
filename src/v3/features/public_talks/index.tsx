import { Box } from '@mui/material';
import Button from '@components/button';
import SearchBar from '@components/search_bar';
import TalksListView from './components/listView';
import Typography from '@components/typography';
import usePublicTalks from './usePublicTalks';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { IconCollapse, IconExpand } from '@components/icons';

const PublicTalks = () => {
  const { t } = useAppTranslation();

  const { tabletDown, laptopUp } = useBreakpoints();

  const { talksList, lastSyncFormatted, handleToggleExpandAll, isExpandAll, handleSearch, txtSearch } =
    usePublicTalks();

  return (
    <Box
      sx={{
        border: '1px solid var(--accent-300)',
        borderRadius: 'var(--radius-xl)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        backgroundColor: 'var(--white)',
      }}
    >
      <SearchBar placeholder={t('tr_search')} onSearch={handleSearch} />

      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: tabletDown ? '8px' : '16px', flexWrap: 'wrap' }}>
          <Typography className="h2">{t('tr_countPublicTalks', { count: talksList.length })}</Typography>
          <Typography
            className="body-small-semibold"
            color="var(--accent-400)"
            sx={{ padding: '4px 8px', borderRadius: 'var(--radius-s)', backgroundColor: 'var(--accent-150)' }}
          >
            {lastSyncFormatted}
          </Typography>
        </Box>

        {laptopUp && (
          <Button
            variant="tertiary"
            startIcon={
              isExpandAll ? (
                <IconCollapse height={22} width={22} color="var(--accent-main)" />
              ) : (
                <IconExpand height={22} width={22} color="var(--accent-main)" />
              )
            }
            onClick={handleToggleExpandAll}
          >
            {isExpandAll ? t('tr_collapseAll') : t('tr_expandAll')}
          </Button>
        )}
      </Box>

      <TalksListView isExpandAll={isExpandAll} txtSearch={txtSearch} />
    </Box>
  );
};

export default PublicTalks;
