import { useRecoilValue } from 'recoil';
import { formatDate } from '@services/dateformat';
import { FormattedHistoryType } from '../index.types';
import { useAppTranslation } from '@hooks/index';
import { personsState } from '@states/persons';
import { personGetDisplayName } from '@utils/common';
import { displayNameEnableState, fullnameOptionState } from '@states/settings';

const useHistoryRow = (props: FormattedHistoryType) => {
  const { t } = useAppTranslation();

  const persons = useRecoilValue(personsState);
  const displayNameEnable = useRecoilValue(displayNameEnableState);
  const fullnameOption = useRecoilValue(fullnameOptionState);

  const student = persons.find((record) => record.person_uid === props.history_misc.ayf?.student);
  const assistant = persons.find((record) => record.person_uid === props.history_misc.ayf?.assistant);

  const history: FormattedHistoryType = {
    history_assignment: props.history_assignment,
    history_date: formatDate(new Date(props.history_date), t('tr_shortDateFormat')),
    history_hall: props.history_hall === '1' ? t('tr_hallA') : props.history_hall === '2' ? t('tr_hallB') : '',
    history_misc: {
      ...props.history_misc,
      ayf: {
        student: student ? personGetDisplayName(student, displayNameEnable, fullnameOption) : undefined,
        assistant: assistant ? personGetDisplayName(assistant, displayNameEnable, fullnameOption) : undefined,
      },
    },
  };

  return { history };
};

export default useHistoryRow;
