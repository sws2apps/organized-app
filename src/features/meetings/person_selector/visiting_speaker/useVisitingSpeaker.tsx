import { useEffect, useMemo, useRef, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { AutocompleteInputChangeReason } from '@mui/material/Autocomplete';
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
import { personSchema } from '@services/dexie/schema';
import { ASSIGNMENT_PATH } from '@constants/index';
import { AssignmentCongregation } from '@definition/schedules';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';

const useVisitingSpeaker = ({ week, assignment, talk }: PersonSelectorType) => {
  const timerSource = useRef<NodeJS.Timeout>(undefined);
  const pendingFlushRef = useRef<(() => void) | null>(null);
  const activeSavesRef = useRef(0);
  // stored value the current edit is based on, updated by our own saves
  const editBaseRef = useRef('');

  const setLocalSongSelectorOpen = useSetAtom(weekendSongSelectorOpenState);

  const displayNameEnabled = useAtomValue(displayNameMeetingsEnableState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const schedules = useAtomValue(schedulesState);
  const incomingSpeakers = useAtomValue(incomingSpeakersState);
  const dataView = useAtomValue(userDataViewState);

  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === week);
  }, [schedules, week]);

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

  const value = useMemo(() => {
    const person = options.find((record) => record.person_uid === defaultValue);

    return person || null;
  }, [defaultValue, options]);

  // Tracks concurrent saves with a counter so isSaving only clears once every
  // in-flight save (e.g. a week-change flush plus a new selection) settles.
  const commitAssignment = async (
    payload: PersonOptionsType | string,
    openSongSelector = false
  ) => {
    activeSavesRef.current += 1;
    editBaseRef.current =
      typeof payload === 'string' ? payload : payload.person_uid;
    setIsSaving(true);

    try {
      await schedulesSaveAssignment(schedule, assignment, payload);

      if (openSongSelector && assignment === 'WM_Speaker_Part1') {
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
    } finally {
      activeSavesRef.current -= 1;

      if (activeSavesRef.current === 0) setIsSaving(false);
    }
  };

  const clearPendingSave = () => {
    if (timerSource.current) clearTimeout(timerSource.current);
    pendingFlushRef.current = null;
  };

  // freeSolo: Enter on typed text passes the raw string instead of an option
  const handleSaveAssignment = (selected: PersonOptionsType | string) => {
    clearPendingSave();

    // a clear was already saved by handleValueChange
    if (!selected) return;

    setInputValue(
      typeof selected === 'string' ? selected : selected.person_name
    );
    setIsEditing(false);
    void commitAssignment(selected, true);
  };

  const handleValueChange = (
    text: string,
    reason?: AutocompleteInputChangeReason
  ) => {
    // MUI reconciling its controlled value (e.g. on week change), not user input
    if (reason === 'reset') return;

    if (!isEditing && activeSavesRef.current === 0) {
      editBaseRef.current = defaultValue ?? '';
    }

    setInputValue(text);
    setIsEditing(true);

    if (text.length === 0) {
      clearPendingSave();
      void commitAssignment('');
    }
  };

  const handleValueSave = (event?: { key?: string }) => {
    // Enter already saved through onChange
    if (event?.key === 'Enter') return;

    clearPendingSave();

    // text still matches the selected speaker: nothing to save
    if (value && inputValue === value.person_name) return;

    // bound to this week's schedule, so a week change can flush it safely
    const flush = () => void commitAssignment(inputValue);
    pendingFlushRef.current = flush;

    timerSource.current = setTimeout(() => {
      pendingFlushRef.current = null;
      flush();
    }, 1000);
  };

  useEffect(() => {
    const flush = pendingFlushRef.current;

    clearPendingSave();
    flush?.();

    setIsEditing(false);
  }, [week]);

  useEffect(() => {
    if (isSaving) return;

    // while typing, skip our own saves landing; any other change wins
    if (isEditing && (defaultValue ?? '') === editBaseRef.current) return;

    clearPendingSave();
    setIsEditing(false);
    setInputValue(value ? value.person_name : defaultValue || '');
  }, [defaultValue, value, isEditing, isSaving]);

  useEffect(() => {
    return () => {
      const flush = pendingFlushRef.current;

      clearPendingSave();
      flush?.();
    };
  }, []);

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
