import { useTranslation } from 'react-i18next';
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
}) => {
  const { t } = useTranslation('ui');

  return (
    <Paper sx={{ display: 'flex', flexDirection: 'column', gap: '15px', padding: '20px' }}>
      <S1Header header={t('publishers')} />
      <S1Field field="numberReports" value={publishersReports} />
      <S1Field field="placements" value={publishersPlacements} />
      <S1Field field="videos" value={publishersVideos} />
      <S1Field field="hours" value={publishersHours} />
      <S1Field field="returnVisits" value={publishersReturnVisits} />
      <S1Field field="bibleStudies" value={publishersBibleStudies} />
    </Paper>
  );
};

export default S1Publishers;
