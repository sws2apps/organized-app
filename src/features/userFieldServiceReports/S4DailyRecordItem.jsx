import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { BibleStudies } from '../../classes/BibleStudies';

const styles = {
  label: {
    fontSize: '13px',
    lineHeight: 1.2,
  },
  count: {
    fontSize: '25px',
    fontWeight: 'bold',
  },
};

const S4DailyRecord = ({ report }) => {
  const { t } = useTranslation('ui');

  const date = new Date(report.month_date).getDate();

  const bibleStudies = report.bibleStudies.map((record) => {
    const bs = BibleStudies.get(record);
    return bs.person_name;
  });

  return (
    <Box sx={{ width: '300px', display: 'flex', gap: '8px' }}>
      <Typography
        sx={{
          backgroundColor: '#3f51b5',
          color: 'white',
          width: '50px',
          height: '50px',
          padding: '10px',
          textAlign: 'center',
          borderRadius: '5px',
          fontSize: '18px',
          fontWeight: 'bold',
        }}
      >
        {date}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '25px' }}>
        <Box>
          <Typography sx={styles.label}>{t('S4Placements')}</Typography>
          <Typography sx={styles.count}>{report.placements}</Typography>
        </Box>
        <Box>
          <Typography sx={styles.label}>{t('S4Video')}</Typography>
          <Typography sx={styles.count}>{report.videos}</Typography>
        </Box>
        <Box>
          <Typography sx={styles.label}>{t('S4Hours')}</Typography>
          <Typography sx={styles.count}>{report.duration}</Typography>
        </Box>
        <Box>
          <Typography sx={styles.label}>{t('S4ReturnVisits')}</Typography>
          <Typography sx={styles.count}>{report.returnVisits}</Typography>
        </Box>
        <Box>
          <Typography sx={styles.label}>{t('bibleStudies')}</Typography>
          {bibleStudies.length === 0 && <Typography sx={styles.count}>0</Typography>}
          {bibleStudies.length > 0 && <Typography>{bibleStudies.join(', ')}</Typography>}
        </Box>
      </Box>
    </Box>
  );
};

export default S4DailyRecord;
