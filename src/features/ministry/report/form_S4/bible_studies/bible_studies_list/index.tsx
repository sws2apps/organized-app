import { Box } from '@mui/material';
import { BibleStudiesListProps } from './index.types';
import BibleStudyItem from './bible_study_item';

const BibleStudiesList = ({
  bibleStudies,
  onDelete,
  readOnly,
}: BibleStudiesListProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
      }}
    >
      {bibleStudies.map((study) => (
        <BibleStudyItem
          key={study.person_uid}
          bibleStudy={study}
          onDelete={onDelete}
          readOnly={readOnly}
        />
      ))}
    </Box>
  );
};

export default BibleStudiesList;
