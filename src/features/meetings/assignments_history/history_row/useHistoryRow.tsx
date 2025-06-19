import { JSX, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { CustomClassName } from '@definition/app';
import { useAppTranslation } from '@hooks/index';
import { personsState } from '@states/persons';
import { personGetDisplayName } from '@utils/common';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
  shortDateFormatState,
  userDataViewState,
} from '@states/settings';
import { formatDate } from '@utils/date';
import { FormattedHistoryType } from '../index.types';
import { HistoryRowType } from './index.types';
import Badge from '@components/badge';

const useHistoryRow = ({ assignment, isDialog }: HistoryRowType) => {
  const { t } = useAppTranslation();

  const persons = useAtomValue(personsState);
  const displayNameEnabled = useAtomValue(displayNameMeetingsEnableState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const shortDateFormat = useAtomValue(shortDateFormatState);
  const dataView = useAtomValue(userDataViewState);

  const textColor = useMemo(() => {
    return isDialog ? 'var(--grey-350)' : 'var(--black)';
  }, [isDialog]);

  const textClassname: CustomClassName = useMemo(() => {
    return isDialog ? 'body-regular' : 'body-small-semibold';
  }, [isDialog]);

  const textClassnameAlt: CustomClassName = useMemo(() => {
    return isDialog ? 'body-regular' : 'body-small-regular';
  }, [isDialog]);

  const student = useMemo(() => {
    return persons.find(
      (record) => record.person_uid === assignment.history_misc.ayf?.student
    );
  }, [persons, assignment]);

  const assistant = useMemo(() => {
    return persons.find(
      (record) => record.person_uid === assignment.history_misc.ayf?.assistant
    );
  }, [persons, assignment]);

  const history: FormattedHistoryType = useMemo(() => {
    const mapHall = () => {
      if (assignment.history_misc.dataView !== 'main') return '';

      if (assignment.history_hall === '1') {
        return t('tr_hallA');
      }

      if (assignment.history_hall === '2') {
        return t('tr_hallB');
      }

      return '';
    };

    return {
      history_id: assignment.history_id,
      history_assignment: assignment.history_assignment,
      history_date: formatDate(
        new Date(assignment.history_date),
        shortDateFormat
      ),
      history_hall: mapHall(),
      history_misc: {
        ...assignment.history_misc,
        ayf: {
          student: student
            ? personGetDisplayName(student, displayNameEnabled, fullnameOption)
            : undefined,
          assistant: assistant
            ? personGetDisplayName(
                assistant,
                displayNameEnabled,
                fullnameOption
              )
            : undefined,
        },
      },
    };
  }, [
    assignment,
    assistant,
    displayNameEnabled,
    fullnameOption,
    shortDateFormat,
    student,
    t,
  ]);

  const badges = useMemo(() => {
    const result: JSX.Element[] = [];

    if (assignment.history_misc.dataView !== dataView) {
      result.push(
        <Badge
          key="assignment-dataView"
          text={
            dataView === 'main'
              ? t('tr_languageGroupShort')
              : t('tr_hostCongregationShort')
          }
          color={dataView === 'main' ? 'red' : 'green'}
          size="medium"
          centerContent
        />
      );
    }

    return result;
  }, [t, assignment, dataView]);

  return { history, textColor, textClassname, textClassnameAlt, badges };
};

export default useHistoryRow;
