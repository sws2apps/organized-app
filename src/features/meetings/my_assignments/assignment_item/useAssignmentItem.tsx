import { JSX, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { AssignmentCode } from '@definition/assignment';
import { personsState } from '@states/persons';
import { buildPersonFullname } from '@utils/common';
import {
  fullnameOptionState,
  userDataViewState,
  userLocalUIDState,
} from '@states/settings';
import { formatDate } from '@utils/date';
import { BROTHER_ASSIGNMENT } from '@constants/index';
import { AssignmentItemProps } from './index.types';
import Badge from '@components/badge';

const ADD_CALENDAR_SHOW = false;

const useAssignmentItem = ({ history }: AssignmentItemProps) => {
  const { t } = useAppTranslation();

  const persons = useAtomValue(personsState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const userUID = useAtomValue(userLocalUIDState);
  const dataView = useAtomValue(userDataViewState);

  const class_name = useMemo(() => {
    if (!history.assignment) return '';

    const key = history.assignment.key;

    if (key.endsWith('_A')) {
      return t('tr_hallA');
    }

    if (key.endsWith('_B')) {
      return t('tr_hallB');
    }
  }, [history.assignment, t]);

  const isMidweek = useMemo(() => {
    return history.assignment.key.startsWith('MM_');
  }, [history.assignment]);

  const assignmentDate = useMemo(() => {
    try {
      return formatDate(new Date(history.weekOf), 'd');
    } catch {
      return formatDate(new Date(), 'd');
    }
  }, [history]);

  const badges = useMemo(() => {
    const result: JSX.Element[] = [];

    if (
      history.assignment.dataView === 'main' &&
      !BROTHER_ASSIGNMENT.includes(history.assignment.code) &&
      history.assignment.code !== AssignmentCode.MM_Discussion
    ) {
      result.push(
        <Badge
          key="hallWithName"
          text={t('tr_hallWithName', { name: class_name })}
          color="accent"
          size="medium"
          centerContent
        />
      );
    }

    if (history.assignment.dataView !== dataView) {
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
  }, [class_name, t, history.assignment, dataView]);

  const personGetName = (value: string) => {
    const person = persons.find((record) => record.person_uid === value);
    if (!person) return '';

    const name = buildPersonFullname(
      person.person_data.person_lastname.value,
      person.person_data.person_firstname.value,
      fullnameOption
    );

    return name;
  };

  return {
    assignmentDate,
    isMidweek,
    personGetName,
    userUID,
    ADD_CALENDAR_SHOW,
    badges,
    history,
  };
};

export default useAssignmentItem;
