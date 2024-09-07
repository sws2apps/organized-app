import { BibleStudyItemProps } from './index.types';
import useBibleStudyItem from './useBibleStudyItem';
import MiniChip from '@components/mini_chip';

const BibleStudyItem = (props: BibleStudyItemProps) => {
  const { handleDeleteStudy } = useBibleStudyItem(props);

  return (
    <MiniChip
      label={props.bibleStudy.person_data.person_name}
      edit={true}
      onDelete={handleDeleteStudy}
    />
  );
};

export default BibleStudyItem;
