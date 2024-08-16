import { useRecoilValue } from 'recoil';
import { formatDate } from '@services/dateformat';
import { FormattedHistoryType } from '../index.types';
import { useAppTranslation } from '@hooks/index';
import { personsState } from '@states/persons';
import { personGetDisplayName } from '@utils/common';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
  shortDateFormatState,
} from '@states/settings';
import { HistoryRowType } from './index.types';
import { CustomClassName } from '@definition/app';

const useHistoryRow = ({ assignment, isDialog }: HistoryRowType) => {
  const { t } = useAppTranslation();

  const persons = useRecoilValue(personsState);
  const displayNameEnable = useRecoilValue(displayNameMeetingsEnableState);
  const fullnameOption = useRecoilValue(fullnameOptionState);
  const shortDateFormat = useRecoilValue(shortDateFormatState);

  const student = persons.find(
    (record) => record.person_uid === assignment.history_misc.ayf?.student
  );
  const assistant = persons.find(
    (record) => record.person_uid === assignment.history_misc.ayf?.assistant
  );

  const history: FormattedHistoryType = {
    history_id: assignment.history_id,
    history_assignment: assignment.history_assignment,
    history_date: formatDate(
      new Date(assignment.history_date),
      shortDateFormat
    ),
    history_hall:
      assignment.history_hall === '1'
        ? t('tr_hallA')
        : assignment.history_hall === '2'
          ? t('tr_hallB')
          : '',
    history_misc: {
      ...assignment.history_misc,
      ayf: {
        student: student
          ? personGetDisplayName(student, displayNameEnable, fullnameOption)
          : undefined,
        assistant: assistant
          ? personGetDisplayName(assistant, displayNameEnable, fullnameOption)
          : undefined,
      },
    },
  };

  const textColor = isDialog ? 'var(--grey-350)' : 'var(--black)';

  const textClassname: CustomClassName = isDialog
    ? 'body-regular'
    : 'body-small-semibold';
  const textClassnameAlt: CustomClassName = isDialog
    ? 'body-regular'
    : 'body-small-regular';

  return { history, textColor, textClassname, textClassnameAlt };
};

export default useHistoryRow;
