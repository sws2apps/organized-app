import { useEffect, useMemo, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import type { MajorCleaningEvent } from '@definition/hall_cleaning';
import { monthShortNamesState } from '@states/app';
import { schedulesState } from '@states/schedules';
import {
  congNameState,
  displayNameMeetingsEnableState,
  fullnameOptionState,
  userDataViewState,
} from '@states/settings';
import { personsByViewState } from '@states/persons';
import { AssignmentCode } from '@definition/assignment';
import { personGetDisplayName } from '@utils/common';
import {
  schedulesDutyAllowedForPerson,
  schedulesDutyPersonQualified,
} from '@services/app/schedules';
import { saveMajorCleanings } from '@services/app/major_cleaning';
import {
  activeMajorCleanings,
  hasMajorCleaningDateConflict,
  cleaningActivityLabelKey,
} from '@utils/major_cleaning';
import { useAppTranslation } from '@hooks/index';

export default function useMajorEvents(week: string) {
  const { t } = useAppTranslation();
  const weeks = useAtomValue(schedulesState);
  const type = useAtomValue(userDataViewState);
  const months = useAtomValue(monthShortNamesState);
  const ourName = useAtomValue(congNameState);
  const persons = useAtomValue(personsByViewState);
  const displayNameEnabled = useAtomValue(displayNameMeetingsEnableState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const responsibleOptions = useMemo(() => {
    const code = AssignmentCode.CLEANING_HallResponsible;
    const names = persons
      .filter(
        (person) =>
          !person.person_data.disqualified.value &&
          schedulesDutyAllowedForPerson(person, code, false) &&
          schedulesDutyPersonQualified(
            code,
            person.person_data.assignments.find(
              (record) => record.type === type
            )?.values ?? []
          )
      )
      .map((person) =>
        personGetDisplayName(person, displayNameEnabled, fullnameOption)
      )
      .filter(Boolean);
    return [...new Set(names)].sort((a, b) => a.localeCompare(b));
  }, [persons, type, displayNameEnabled, fullnameOption]);
  const events = activeMajorCleanings(
    weeks.find((item) => item.weekOf === week)?.hall_cleaning?.events,
    type
  );
  const [date, setDate] = useState(() => events[0]?.date ?? week);
  const drafts = useRef<Record<string, MajorCleaningEvent>>({});
  const [, redraw] = useState(0);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [rows, setRows] = useState<
    Record<string, MajorCleaningEvent['participants']>
  >({});
  const [pending, setPending] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const visibleEvents = [
    ...new Map(
      [...events, ...Object.values(drafts.current)].map((item) => [
        item.id,
        item,
      ])
    ).values(),
  ]
    .filter((item) => !item.deleted)
    .sort((a, b) => a.date.localeCompare(b.date));
  const current =
    Object.values(drafts.current).find((item) => item.date === date) ??
    events.find((item) => item.date === date);
  const event = current?.deleted ? undefined : current;
  useEffect(() => {
    if (event) return;
    const next = visibleEvents[0];
    if (next && next.date !== date) setDate(next.date);
  }, [date, event, visibleEvents]);
  const persist = async (next: MajorCleaningEvent) => {
    drafts.current[next.id] = next;
    redraw((value) => value + 1);
    setPending((value) => value + 1);
    setErrors((value) => ({ ...value, [next.date]: '' }));
    try {
      await saveMajorCleanings([next]);
      if (drafts.current[next.id] === next) {
        setErrors((value) => ({ ...value, [next.date]: '' }));
        delete drafts.current[next.id];
        redraw((value) => value + 1);
      }
    } catch (error) {
      setErrors((value) => ({
        ...value,
        [next.date]:
          (error as Error).message === 'major-cleaning-date-conflict'
            ? t('tr_majorDateConflict')
            : t('tr_hallCleaningSaveFailedDesc'),
      }));
    } finally {
      setPending((value) => value - 1);
    }
  };
  const update = (
    changes: Partial<
      Pick<MajorCleaningEvent, 'participants' | 'coordinator' | 'activity'>
    >
  ) => {
    const latest =
      Object.values(drafts.current).find((item) => item.date === date) ??
      events.find((item) => item.date === date);
    const base =
      latest && !latest.deleted
        ? latest
        : {
            id: crypto.randomUUID(),
            type,
            date,
            participants: [{ id: 'our-congregation', name: ourName }],
            coordinator: '',
            notes: '',
            updatedAt: '',
          };
    const nextParticipants = changes.participants ?? base.participants;
    const includesOwn = nextParticipants.some(
      (item) => item.id === 'our-congregation' || item.name === ourName
    );
    void persist({
      ...base,
      ...changes,
      participants: includesOwn
        ? nextParticipants
        : [{ id: 'our-congregation', name: ourName }, ...nextParticipants],
      updatedAt: new Date().toISOString(),
    });
  };
  const add = () => {
    if (event || pending) return;
    const nextDate = date;
    setDate(nextDate);
    void persist({
      id: crypto.randomUUID(),
      type,
      date: nextDate,
      participants: [{ id: 'our-congregation', name: ourName }],
      coordinator: '',
      notes: '',
      updatedAt: new Date().toISOString(),
    });
  };
  const remove = () => {
    if (event && !pending) {
      setExpanded((value) => ({ ...value, [date]: false }));
      setRows((value) => ({ ...value, [date]: [] }));
      const remaining = events.find((item) => item.id !== event.id);
      if (remaining) setDate(remaining.date);
      void persist({
        ...event,
        deleted: true,
        updatedAt: new Date().toISOString(),
      });
    }
  };
  const own = { id: 'our-congregation', name: ourName };
  const extras =
    rows[date] ??
    (event?.participants ?? []).filter(
      (item) => item.id !== own.id && item.name !== ourName
    );
  const multiple = expanded[date] ?? extras.length > 0;
  const updateCongregations = (next: MajorCleaningEvent['participants']) => {
    setRows((value) => ({ ...value, [date]: next }));
    update({
      participants: [
        own,
        ...next
          .filter((item) => item.name.trim())
          .map((item) => ({ ...item, name: item.name.trim() })),
      ],
    });
  };
  const toggleMultiple = (enabled: boolean) => {
    setExpanded((value) => ({ ...value, [date]: enabled }));
    if (!enabled) updateCongregations([]);
    else if (extras.length === 0)
      setRows((value) => ({
        ...value,
        [date]: [{ id: crypto.randomUUID(), name: '' }],
      }));
  };
  return {
    responsibleOptions,
    scheduledActivities: visibleEvents.map((item) => {
      const day = new Date(item.date);
      return {
        value: item.date,
        label: `${t('tr_longDateNoYearLocale', { month: months[day.getMonth()], date: day.getDate() })} · ${t(cleaningActivityLabelKey(item.activity))}`,
      };
    }),
    selectActivity: setDate,
    extras,
    multiple,
    toggleMultiple,
    addCongregation: () =>
      setRows((value) => ({
        ...value,
        [date]: [...extras, { id: crypto.randomUUID(), name: '' }],
      })),
    changeCongregation: (id: string, name: string) =>
      updateCongregations(
        extras.map((item) => (item.id === id ? { ...item, name } : item))
      ),
    removeCongregation: (id: string) => {
      const remaining = extras.filter((item) => item.id !== id);
      if (remaining.length === 0) {
        setExpanded((value) => ({ ...value, [date]: false }));
      }
      updateCongregations(remaining);
    },
    date,
    setDate: (nextDate: string) => {
      if (!event || pending || nextDate === date) return;
      if (hasMajorCleaningDateConflict(events, { ...event, date: nextDate })) {
        setErrors((value) => ({ ...value, [date]: t('tr_majorDateConflict') }));
        return;
      }
      setDate(nextDate);
      void persist({
        ...event,
        date: nextDate,
        updatedAt: new Date().toISOString(),
      });
    },
    event,
    add,
    update,
    remove,
    busy: pending > 0,
    error: errors[date],
    retry: () => {
      const draft = Object.values(drafts.current).find(
        (item) => item.date === date
      );
      if (draft) void persist(draft);
    },
  };
}
