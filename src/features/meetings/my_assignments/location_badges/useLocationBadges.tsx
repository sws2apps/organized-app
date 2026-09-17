import { useAtomValue } from 'jotai';
import { AssignmentCode } from '@definition/assignment';
import { AssignmentHistoryType } from '@definition/schedules';
import { BROTHER_ASSIGNMENT } from '@constants/index';
import { userDataViewState } from '@states/settings';
import { useAppTranslation } from '@hooks/index';

const useLocationBadges = (history: AssignmentHistoryType) => {
  const { t } = useAppTranslation();

  const dataView = useAtomValue(userDataViewState);

  const { key = '', code } = history.assignment;

  const hall =
    history.assignment.dataView === 'main' &&
    !BROTHER_ASSIGNMENT.includes(code) &&
    code !== AssignmentCode.MM_Discussion
      ? t('tr_hallWithName', {
          name: key.endsWith('_B') ? t('tr_hallB') : t('tr_hallA'),
        })
      : '';

  const isOtherDataView = history.assignment.dataView !== dataView;

  const dataViewLabel = isOtherDataView
    ? dataView === 'main'
      ? t('tr_languageGroupShort')
      : t('tr_hostCongregationShort')
    : '';

  const dataViewColor: 'red' | 'green' = dataView === 'main' ? 'red' : 'green';

  return { hall, dataViewLabel, dataViewColor };
};

export default useLocationBadges;
