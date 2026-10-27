import { useEffect, useMemo, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { CircuitOverseerEventType } from '@definition/circuit_overseer_visit';
import { personsActiveState, personsState } from '@states/persons';
import {
  congAddressState,
  displayNameMeetingsEnableState,
  fullnameOptionState,
  midweekMeetingTimeState,
  weekendMeetingTimeState,
} from '@states/settings';
import { dbCircuitOverseerEventSave } from '@services/dexie/circuit_overseer_visit';
import { personGetDisplayName } from '@utils/common';
import { formatDate, generateDateFromTime } from '@utils/date';
import { EventEditorProps, HostOption } from './index.types';

type EventData = CircuitOverseerEventType['event_data'];

const saveEvent = (event_uid: string, value: EventData) =>
  dbCircuitOverseerEventSave({
    event_uid,
    event_data: { ...value, updatedAt: new Date().toISOString() },
  });

const useEventEditor = ({ event }: EventEditorProps) => {
  const persons = useAtomValue(personsState);
  const personsActive = useAtomValue(personsActiveState);
  const displayNameEnabled = useAtomValue(displayNameMeetingsEnableState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const midweekTime = useAtomValue(midweekMeetingTimeState);
  const weekendTime = useAtomValue(weekendMeetingTimeState);
  const congAddress = useAtomValue(congAddressState);

  const [data, setData] = useState(event.event_data);

  const latest = useRef(event.event_data);
  const timer = useRef<NodeJS.Timeout>(undefined);

  const time = data.time ? generateDateFromTime(data.time) : null;

  const hostOptions = useMemo(() => {
    const toOption = (uid: string): HostOption => {
      const person = persons.find((record) => record.person_uid === uid);

      return {
        person_uid: uid,
        person_name: person
          ? personGetDisplayName(person, displayNameEnabled, fullnameOption)
          : '',
      };
    };

    const uids = new Set([
      ...personsActive.map((person) => person.person_uid),
      ...data.hosts,
    ]);

    return Array.from(uids, toOption).sort((a, b) =>
      a.person_name.localeCompare(b.person_name)
    );
  }, [persons, personsActive, data.hosts, displayNameEnabled, fullnameOption]);

  const hostsSelected = hostOptions.filter((option) =>
    data.hosts.includes(option.person_uid)
  );

  const uid = event.event_uid;

  // text is saved once typing pauses, other fields right away
  const handleChange = (changes: Partial<EventData>, debounce = false) => {
    const value = { ...latest.current, ...changes };

    latest.current = value;
    setData(value);

    clearTimeout(timer.current);

    timer.current = undefined;

    if (debounce) {
      timer.current = setTimeout(() => {
        timer.current = undefined;
        void saveEvent(uid, value);
      }, 500);
      return;
    }

    void saveEvent(uid, value);
  };

  const handleTimeChange = (value: Date | null) => {
    handleChange({ time: value ? formatDate(value, 'HH:mm') : '' });
  };

  const handleCategoryChange = (category: EventData['category']) => {
    const changes: Partial<EventData> = { category };

    if (category === 'midweek' || category === 'weekend') {
      if (!latest.current.time) {
        changes.time = category === 'midweek' ? midweekTime : weekendTime;
      }

      if (!latest.current.address) changes.address = congAddress;
    }

    if (category !== 'hospitality') changes.hosts = [];

    handleChange(changes);
  };

  const handleDelete = () => {
    handleChange({ _deleted: true });
  };

  useEffect(() => {
    if (timer.current) return;

    latest.current = event.event_data;
    setData(event.event_data);
  }, [event.event_data]);

  useEffect(() => {
    return () => {
      if (!timer.current) return;

      clearTimeout(timer.current);
      void saveEvent(uid, latest.current);
    };
  }, [uid]);

  return {
    data,
    time,
    hostOptions,
    hostsSelected,
    handleChange,
    handleTimeChange,
    handleCategoryChange,
    handleDelete,
  };
};

export default useEventEditor;
