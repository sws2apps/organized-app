import { Box } from '@mui/material';
import Button from '@components/button';
import SearchBar from '@components/search_bar';
import TalksListView from './components/listView';
import TalksTableView from './components/tableView';
import Typography from '@components/typography';
import usePublicTalks from './usePublicTalks';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { IconCollapse, IconExpand, IconExport } from '@components/icons';
import { PublicTalksViewType } from '@definition/sources';

type PublicTalksType = {
  view: PublicTalksViewType;
};

const PublicTalks = ({ view }: PublicTalksType) => {
  const { t } = useAppTranslation();

  const { tabletDown, laptopUp } = useBreakpoints();

  const {
    talksList,
    lastSyncFormatted,
    handleToggleExpandAll,
    isExpandAll,
    handleSearch,
    labelSearch,
    txtSearch,
    isConnected,
  } = usePublicTalks();

  const getTableHeight = () => {
    let height: string;

    if (laptopUp) {
      height = '80vh';
    }

    if (!isConnected && !laptopUp) {
      height = '75vh';
    }

    if (isConnected && !laptopUp) {
      height = '70vh';
    }

    return height;
  };

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
        height: getTableHeight(),
      }}
    >
      <SearchBar placeholder={t('tr_search')} value={txtSearch} onSearch={handleSearch} />

      <Box
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: tabletDown ? '8px' : '16px', flexWrap: 'wrap' }}>
          <Typography className="h2">{t(labelSearch, { count: talksList.length })}</Typography>
          <Typography
            className="body-small-semibold"
            color="var(--accent-400)"
            sx={{ padding: '4px 8px', borderRadius: 'var(--radius-s)', backgroundColor: 'var(--accent-150)' }}
          >
            {lastSyncFormatted}
          </Typography>
        </Box>

        {view === 'list' && laptopUp && (
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

        {view === 'table' && laptopUp && (
          <Button variant="tertiary" startIcon={<IconExport height={22} width={22} color="var(--accent-dark)" />}>
            {t('tr_exportS99')}
          </Button>
        )}
      </Box>

      {view === 'list' && <TalksListView isExpandAll={isExpandAll} />}
      {view === 'table' && <TalksTableView />}
    </Box>
  );
};

export default PublicTalks;
