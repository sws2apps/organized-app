import { BibleStudyItemProps } from './index.types';
import MiniChip from '@components/mini_chip';

const BibleStudyItem = ({
  bibleStudy,
  readOnly,
  onDelete,
}: BibleStudyItemProps) => {
  return (
    <MiniChip
      label={bibleStudy.person_data.person_name}
      edit={!readOnly}
      onDelete={() => onDelete(bibleStudy)}
    />
  );
};

export default BibleStudyItem;
