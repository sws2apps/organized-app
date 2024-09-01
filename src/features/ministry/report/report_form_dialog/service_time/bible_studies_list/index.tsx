import { Box } from '@mui/material';
import useBibleStudiesList from './useBibleStudiesList';
import BibleStudyItem from './bible_study_item';

const BibleStudiesList = () => {
  const { selectedBibleStudies } = useBibleStudiesList();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
      }}
    >
      {selectedBibleStudies.map((study) => (
        <BibleStudyItem key={study.person_uid} bibleStudy={study} />
      ))}
    </Box>
  );
};

export default BibleStudiesList;
