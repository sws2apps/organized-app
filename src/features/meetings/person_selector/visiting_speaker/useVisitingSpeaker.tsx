import { useEffect, useMemo, useRef, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { IconError } from '@components/icons';
import { PersonOptionsType, PersonSelectorType } from '../index.types';
import {
  displayNameMeetingsEnableState,
  fullnameOptionState,
  userDataViewState,
} from '@states/settings';
import {
  schedulesState,
  weekendSongSelectorOpenState,
} from '@states/schedules';
import { personGetDisplayName } from '@utils/common';
import {
  schedulesGetData,
  schedulesSaveAssignment,
} from '@services/app/schedules';
import { incomingSpeakersState } from '@states/visiting_speakers';
import { personsByViewState } from '@states/persons';
import { personSchema } from '@services/dexie/schema';
import { ASSIGNMENT_PATH } from '@constants/index';
import { AssignmentCongregation } from '@definition/schedules';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';

const useVisitingSpeaker = ({ week, assignment, talk }: PersonSelectorType) => {
  const timerSource = useRef<NodeJS.Timeout>(undefined);

  const setLocalSongSelectorOpen = useSetAtom(weekendSongSelectorOpenState);

  const displayNameEnabled = useAtomValue(displayNameMeetingsEnableState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const schedules = useAtomValue(schedulesState);
  const incomingSpeakers = useAtomValue(incomingSpeakersState);
  const persons = useAtomValue(personsByViewState);
  const dataView = useAtomValue(userDataViewState);

  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

  // Name-to-UID resolution below is only safe for the "Local Speaker" talk
  // type, where the app enforces unique person names within the
  // congregation. Other talk types (visiting speaker, host congregation,
  // group) can legitimately have identical names across congregations.
  const talkType = useMemo(() => {
    const type = schedule?.weekend_meeting.public_talk_type.find(
      (record) => record.type === dataView
    )?.value;

    return type ?? 'localSpeaker';
  }, [schedule, dataView]);

  const options = useMemo(() => {
    const filteredPersons: PersonOptionsType[] = [];

    for (const speaker of incomingSpeakers) {
      if (talk) {
        const activeTalks = speaker.speaker_data.talks.filter(
          (record) => record._deleted === false && record.talk_number === talk
        );

        if (activeTalks.length === 0) {
          continue;
        }
      }

      const person: PersonOptionsType = structuredClone(personSchema);

      person.person_uid = speaker.person_uid;
      person.person_data.person_lastname.value =
        speaker.speaker_data.person_lastname.value;
      person.person_data.person_firstname.value =
        speaker.speaker_data.person_firstname.value;
      person.person_data.person_display_name.value =
        speaker.speaker_data.person_display_name.value;
      person.person_data.male.value = true;

      filteredPersons.push(person);
    }

    const newPersons = filteredPersons.map((record) => {
      return {
        ...record,
        person_name: personGetDisplayName(
          record,
          displayNameEnabled,
          fullnameOption
        ),
      };
    });

    return newPersons.sort((a, b) =>
      a.person_name.localeCompare(b.person_name)
    );
  }, [displayNameEnabled, fullnameOption, talk, incomingSpeakers]);

  const defaultValue = useMemo(() => {
    if (week.length === 0) return null;

    const path = ASSIGNMENT_PATH[assignment];

    if (!path) return null;

    const dataSchedule = schedulesGetData(schedule, path);
    let assigned: AssignmentCongregation;

    if (Array.isArray(dataSchedule)) {
      assigned = dataSchedule.find((record) => record.type === dataView);
    } else {
      assigned = dataSchedule;
    }

    return assigned?.value;
  }, [week, schedule, dataView, assignment]);

  const catalogMatch = useMemo(() => {
    return options.find((record) => record.person_uid === defaultValue) ?? null;
  }, [defaultValue, options]);

  // Fallback for assignments referencing a congregation member who isn't
  // (yet) part of the Speakers Catalog - this happens for members resolved
  // by name below. Without this, the display would fall back to showing
  // the raw UID instead of the person's name.
  const localPersonMatch = useMemo(() => {
    if (catalogMatch || !defaultValue) return null;

    const person = persons.find((record) => record.person_uid === defaultValue);

    if (!person) return null;

    return {
      ...person,
      person_name: personGetDisplayName(person, displayNameEnabled, fullnameOption),
    } as PersonOptionsType;
  }, [catalogMatch, defaultValue, persons, displayNameEnabled, fullnameOption]);

  const value = catalogMatch ?? localPersonMatch;

  // Single place where a typed name may be upgraded to a real person
  // reference. Only applies in "Local Speaker" mode, and only on an exact,
  // unambiguous display-name match.
  const resolveLocalPersonByName = (name: string): PersonOptionsType | null => {
    if (talkType !== 'localSpeaker' || !name) return null;

    const match = persons.find(
      (record) => personGetDisplayName(record, displayNameEnabled, fullnameOption) === name
    );

    if (!match) return null;

    return { ...match, person_name: name } as PersonOptionsType;
  };

  // Single value representing what would currently be persisted: the
  // resolved catalog selection while the user isn't actively editing the
  // text, or the raw typed text once they diverge from that selection.
  const pendingValue = useMemo(() => {
    return isEditing ? inputValue : value ?? inputValue;
  }, [isEditing, inputValue, value]);

  // Single place that actually persists an assignment, so error handling,
  // the "open song selector" side effect, and the local-name resolution
  // only exist once instead of being duplicated across every handler that
  // can trigger a save.
  const commitAssignment = async (payload: PersonOptionsType | string) => {
    let finalPayload = payload;

    if (typeof payload === 'string' && payload.length > 0) {
      finalPayload = resolveLocalPersonByName(payload) ?? payload;
    }

    try {
      await schedulesSaveAssignment(schedule, assignment, finalPayload);

      if (assignment === 'WM_Speaker_Part1' && typeof finalPayload !== 'string') {
        setLocalSongSelectorOpen(true);
      }
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: error.message,
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
    }
  };

  const handleSaveAssignment = (selected: PersonOptionsType) => {
    if (timerSource.current) clearTimeout(timerSource.current);

    setIsEditing(false);
    commitAssignment(selected);
  };

  // `reason` is forwarded by AutoComplete from MUI's onInputChange. MUI can
  // call this with an empty string and reason "reset" purely to reconcile
  // its own controlled value/inputValue pair (e.g. right after the
  // assignment resolves to a real option on navigation) - that is not user
  // input and must never be treated as a request to clear the assignment.
  const handleValueChange = (text: string, reason?: string) => {
    setInputValue(text);

    if (reason === 'reset') return;

    setIsEditing(true);

    if (text.length === 0) {
      commitAssignment('');
    }
  };

  const handleValueSave = () => {
    if (timerSource.current) clearTimeout(timerSource.current);

    timerSource.current = setTimeout(() => commitAssignment(pendingValue), 1000);
  };

  // Keep the visible input text in sync with the resolved selection and
  // drop any in-progress free-text edit whenever the underlying assignment
  // changes (e.g. after navigating to a different week).
  useEffect(() => {
    setIsEditing(false);
    setInputValue(value ? value.person_name : defaultValue || '');
  }, [defaultValue, value]);

  return {
    options,
    handleSaveAssignment,
    value,
    inputValue,
    handleValueChange,
    handleValueSave,
  };
};

export default useVisitingSpeaker;
