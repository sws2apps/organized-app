import { Box, Collapse, Grid2 as Grid } from '@mui/material';
import { IconExpand } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useDelegateReports from './useDelegateReports';
import TabLabelWithBadge from '@components/tab_label_with_badge';
import ReportItem from './report_item';

const DelegateReports = () => {
  const { t } = useAppTranslation();

  const { publishers, open, handleToggleCollapse } = useDelegateReports();

  if (publishers.length === 0) return <></>;

  return (
    <>
      <Box
        onClick={handleToggleCollapse}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          width: 'fit-content',
        }}
      >
        <TabLabelWithBadge
          count={publishers.length}
          label={t('tr_delegatedPersons')}
          className="h3"
          badgeColor="var(--accent-dark)"
        />

        <IconExpand
          color="var(--black)"
          sx={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s',
          }}
        />
      </Box>

      <Collapse
        in={open}
        timeout="auto"
        unmountOnExit
        sx={{ marginTop: '16px !important' }}
      >
        <Grid container spacing={2}>
          {publishers.map((person) => (
            <ReportItem key={person.person_uid} person={person} />
          ))}
        </Grid>
      </Collapse>
    </>
  );
};

export default DelegateReports;
