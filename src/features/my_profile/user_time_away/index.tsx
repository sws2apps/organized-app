import { useAppTranslation } from '@hooks/index';
import useUserTimeAway from './useUserTimeAway';
import TimeAwayEditor from '@features/persons/time_away_editor';

const UserTimeAway = () => {
  const { t } = useAppTranslation();

  const {
    allRecords,
    handleAdd,
    handleCommentsChange,
    handleEndDateChange,
    handleStartDateChange,
    handleDelete,
  } = useUserTimeAway();

  return (
    <TimeAwayEditor
      desc={allRecords.length === 0 ? t('tr_timeAwayDesc') : undefined}
      items={allRecords}
      onAdd={handleAdd}
      onCommentsChange={handleCommentsChange}
      onDelete={handleDelete}
      onEndDateChange={handleEndDateChange}
      onStartDateChange={handleStartDateChange}
    />
  );
};

export default UserTimeAway;
