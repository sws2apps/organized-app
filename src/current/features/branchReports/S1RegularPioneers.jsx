import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import S1Header from './S1Header';
import S1Field from './S1Field';

const S1RegularPioneers = ({
  FRReports,
  FRPlacements,
  FRVideos,
  FRHours,
  FRReturnVisits,
  FRBibleStudies,
  gridViews,
}) => {
  const { t } = useTranslation('ui');

  return (
    <Grid item xs={gridViews.xs} sm={gridViews.sm} md={gridViews.md} lg={gridViews.lg}>
      <Paper sx={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px' }}>
        <S1Header header={t('regularPioneers')} />
        <S1Field field="numberReports" value={FRReports} />
        <S1Field field="placements" value={FRPlacements} />
        <S1Field field="videos" value={FRVideos} />
        <S1Field field="hours" value={FRHours} />
        <S1Field field="returnVisits" value={FRReturnVisits} />
        <S1Field field="bibleStudies" value={FRBibleStudies} />
      </Paper>
    </Grid>
  );
};

export default S1RegularPioneers;
