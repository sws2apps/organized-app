import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import S1Header from './S1Header';
import S1Field from './S1Field';

const S1AuxiliaryPioneers = ({
  auxPioneersReports,
  auxPioneersPlacements,
  auxPioneersVideos,
  auxPioneersHours,
  auxPioneersReturnVisits,
  auxPioneersBibleStudies,
  gridViews,
}) => {
  const { t } = useTranslation('ui');

  return (
    <Grid item xs={gridViews.xs} sm={gridViews.sm} md={gridViews.md} lg={gridViews.lg}>
      <Paper sx={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px' }}>
        <S1Header header={t('auxiliaryPioneers')} />
        <S1Field field="numberReports" value={auxPioneersReports} />
        <S1Field field="placements" value={auxPioneersPlacements} />
        <S1Field field="videos" value={auxPioneersVideos} />
        <S1Field field="hours" value={auxPioneersHours} />
        <S1Field field="returnVisits" value={auxPioneersReturnVisits} />
        <S1Field field="bibleStudies" value={auxPioneersBibleStudies} />
      </Paper>
    </Grid>
  );
};

export default S1AuxiliaryPioneers;
