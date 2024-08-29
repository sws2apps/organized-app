import { useRecoilValue } from 'recoil';
import { bibleStudyEditorOpenState } from '@states/user_bible_studies';

const useReportDaily = () => {
  const bibleStudyOpen = useRecoilValue(bibleStudyEditorOpenState);

  return {
    bibleStudyOpen,
  };
};

export default useReportDaily;
