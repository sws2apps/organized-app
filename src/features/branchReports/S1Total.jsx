import { useTranslation } from 'react-i18next';
import Paper from '@mui/material/Paper';
import S1Header from './S1Header';
import S1Field from './S1Field';

const S1Total = ({ totalReports, totalPlacements, totalVideos, totalHours, totalReturnVisits, totalBibleStudies }) => {
  const { t } = useTranslation('ui');

  return (
    <Paper sx={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px' }}>
      <S1Header header={t('totals')} />
      <S1Field field="numberReports" value={totalReports} />
      <S1Field field="placements" value={totalPlacements} />
      <S1Field field="videos" value={totalVideos} />
      <S1Field field="hours" value={totalHours} />
      <S1Field field="returnVisits" value={totalReturnVisits} />
      <S1Field field="bibleStudies" value={totalBibleStudies} />
    </Paper>
  );
};

export default S1Total;
