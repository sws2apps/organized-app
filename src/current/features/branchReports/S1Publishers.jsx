import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import S1Header from './S1Header';
import S1Field from './S1Field';

const S1Publishers = ({
  publishersReports,
  publishersPlacements,
  publishersVideos,
  publishersHours,
  publishersReturnVisits,
  publishersBibleStudies,
  gridViews,
}) => {
  const { t } = useTranslation('ui');

  return (
    <Grid item xs={gridViews.xs} sm={gridViews.sm} md={gridViews.md} lg={gridViews.lg}>
      <Paper sx={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px' }}>
        <S1Header header={t('publishers')} />
        <S1Field field="numberReports" value={publishersReports} />
        <S1Field field="placements" value={publishersPlacements} />
        <S1Field field="videos" value={publishersVideos} />
        <S1Field field="hours" value={publishersHours} />
        <S1Field field="returnVisits" value={publishersReturnVisits} />
        <S1Field field="bibleStudies" value={publishersBibleStudies} />
      </Paper>
    </Grid>
  );
};

export default S1Publishers;
