import { useCallback, useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { personsState } from '@states/persons';
import { buildPersonFullname, normalizeAllCaps } from '@utils/common';
import {
  JWLangState,
  fullnameOptionState,
  userLocalUIDState,
} from '@states/settings';
import { sourcesState } from '@states/sources';
import { formatDate, getWeekDate } from '@utils/date';
import { getAssignmentCategory } from '../categories';
import { AssignmentHistoryType } from '@definition/schedules';
import { useAppTranslation } from '@hooks/index';

const useAssignmentItem = ({ history }: { history: AssignmentHistoryType }) => {
  const { t } = useAppTranslation();

  const persons = useAtomValue(personsState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const userUID = useAtomValue(userLocalUIDState);
  const sources = useAtomValue(sourcesState);
  const lang = useAtomValue(JWLangState);

  const personGetName = useCallback(
    (value: string) => {
      const person = persons.find((record) => record.person_uid === value);
      if (!person) return '';

      return buildPersonFullname(
        person.person_data.person_lastname.value,
        person.person_data.person_firstname.value,
        fullnameOption
      );
    },
    [persons, fullnameOption]
  );

  const category = useMemo(() => getAssignmentCategory(history), [history]);

  const delegate =
    history.assignment.person !== userUID
      ? personGetName(history.assignment.person)
      : '';

  const { ayf, src, desc, key = '' } = history.assignment;

  // the meeting moves to the second line, so the chairman reads as a role
  const title =
    key === 'MM_Chairman_A' || key === 'WM_Chairman'
      ? t('tr_chairman')
      : history.assignment.title;

  const details = useMemo(() => {
    const result = [
      ayf?.student && `${t('tr_student')}: ${personGetName(ayf.student)}`,
      ayf?.assistant && `${t('tr_assistant')}: ${personGetName(ayf.assistant)}`,
      src,
      desc,
    ].filter((detail): detail is string => Boolean(detail));

    if (result.length > 0) return result;

    // spiritual gems come from this week's Bible reading
    if (key === 'MM_TGWGems') {
      const weekOf = formatDate(
        getWeekDate(new Date(history.weekOf)),
        'yyyy/MM/dd'
      );
      const reading = sources.find((record) => record.weekOf === weekOf)
        ?.midweek_meeting?.weekly_bible_reading?.[lang];

      if (reading) return [normalizeAllCaps(reading)];
    }

    // every other part without details names its meeting
    return [
      key.startsWith('MM_') ? t('tr_midweekMeeting') : t('tr_weekendMeeting'),
    ];
  }, [ayf, src, desc, key, history.weekOf, sources, lang, t, personGetName]);

  return { category, title, details, delegate };
};

export default useAssignmentItem;
