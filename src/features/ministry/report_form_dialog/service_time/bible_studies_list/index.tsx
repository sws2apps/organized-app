import useBibleStudiesList from './useBibleStudiesList';
import BibleStudyItem from './bible_study_item';

const BibleStudiesList = () => {
  const { selectedBibleStudies } = useBibleStudiesList();

  return (
    <>
      {selectedBibleStudies.map((study) => (
        <BibleStudyItem key={study.person_uid} bibleStudy={study} />
      ))}
    </>
  );
};

export default BibleStudiesList;
