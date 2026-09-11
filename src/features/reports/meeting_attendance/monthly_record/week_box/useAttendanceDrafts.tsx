import { useCallback, useEffect, useMemo } from 'react';
import { useSetAtom } from 'jotai';
import { ATTENDANCE_AUTOSAVE_DELAY } from '@constants/index';
import { AutosaveDraft } from '@definition/autosave';
import {
  AttendanceRecordField,
  AttendanceValues,
} from '@definition/meeting_attendance';
import { meetingAttendanceSaveState } from '@states/meeting_attendance';
import useAutosaveDrafts from '@hooks/useAutosaveDrafts';
import {
  AttendanceDraftsProps,
  AttendancePendingSave,
  WeekBoxValues,
} from '@features/reports/meeting_attendance/monthly_record/week_box/index.types';

/** The fields a record spells differently from the view. */
const STORED_FIELD: Partial<
  Record<keyof WeekBoxValues, AttendanceRecordField>
> = {
  presentDeaf: 'present_deaf',
  onlineDeaf: 'online_deaf',
};

const useAttendanceDrafts = ({
  initialValues,
  recordKey,
  disabled,
  params,
}: AttendanceDraftsProps) => {
  const saveAttendanceRecord = useSetAtom(meetingAttendanceSaveState);
  const { key, drafts, getDrafts, updateDrafts, isCurrentScope } =
    useAutosaveDrafts(`attendance:${recordKey}`);
  const { month, index, type, dataView, recordDeaf } = params;
  const { saves: pending } = useMemo(
    () => ({
      key,
      saves: new Map<keyof WeekBoxValues, AttendancePendingSave>(),
    }),
    [key]
  );

  const persist = useCallback(
    async (entries: Record<string, AutosaveDraft>) => {
      if (disabled || !isCurrentScope()) return;
      const latest = getDrafts();
      const fields = Object.keys(entries).filter(
        (field) =>
          latest[field]?.revision === entries[field].revision &&
          ['pending', 'failed'].includes(latest[field].status)
      ) as (keyof WeekBoxValues)[];
      if (!fields.length) return;
      const counts: AttendanceValues = {};
      for (const field of fields) {
        const storedField =
          STORED_FIELD[field] ?? (field as AttendanceRecordField);
        counts[storedField] = entries[field].value;
      }
      const setStatus = (status: AutosaveDraft['status']) =>
        updateDrafts((current) => {
          const next = { ...current };
          for (const field of fields) {
            if (current[field]?.revision === entries[field].revision) {
              next[field] = { ...current[field], status };
            }
          }
          return next;
        });
      setStatus('saving');
      const success = await saveAttendanceRecord({
        month,
        index,
        type,
        dataView,
        recordDeaf,
        values: counts,
      });
      setStatus(success ? 'saved' : 'failed');
    },
    [
      disabled,
      isCurrentScope,
      getDrafts,
      updateDrafts,
      saveAttendanceRecord,
      month,
      index,
      type,
      dataView,
      recordDeaf,
    ]
  );

  /**
   * Saves what an earlier hook left behind.
   *
   * A draft that failed is retried, and so is one still pending with no timer
   * of its own: that is a draft whose hook went away before it could be
   * written, as happens when the account is switched within the debounce, and
   * nothing else would ever pick it up.
   */
  const retryStalled = useCallback(() => {
    const entries = Object.fromEntries(
      Object.entries(getDrafts()).filter(
        ([field, draft]) =>
          draft.status === 'failed' ||
          (draft.status === 'pending' &&
            !pending.has(field as keyof WeekBoxValues))
      )
    );
    void persist(entries);
  }, [getDrafts, pending, persist]);

  useEffect(() => {
    const flush = () => {
      for (const task of pending.values()) {
        clearTimeout(task.timer);
        void task.save();
      }
      pending.clear();
      retryStalled();
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') flush();
      else retryStalled();
    };
    retryStalled();
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', handleVisibility);
      flush();
    };
  }, [pending, retryStalled]);

  useEffect(() => {
    updateDrafts((current) => {
      const next = { ...current };
      let changed = false;
      for (const field of Object.keys(next) as (keyof WeekBoxValues)[]) {
        const draft = next[field];
        if (draft.status === 'saved' && initialValues[field] === draft.value) {
          delete next[field];
          changed = true;
        }
      }
      return changed ? next : current;
    });
  }, [drafts, initialValues, updateDrafts]);

  const values = useMemo(() => {
    const result = { ...initialValues };
    for (const field of Object.keys(drafts) as (keyof WeekBoxValues)[]) {
      result[field] = drafts[field].value;
    }
    return result;
  }, [drafts, initialValues]);

  const prepareSave = (changes: Partial<WeekBoxValues>) => {
    if (disabled || !isCurrentScope()) return;
    const entries: Record<string, AutosaveDraft> = {};
    for (const field of Object.keys(changes) as (keyof WeekBoxValues)[]) {
      const value = changes[field];
      if (value === undefined) continue;
      clearTimeout(pending.get(field)?.timer);
      pending.delete(field);
      entries[field] = {
        value,
        revision: crypto.randomUUID(),
        status: 'pending',
      };
    }
    if (!Object.keys(entries).length) return;
    updateDrafts((current) => ({ ...current, ...entries }));
    return () => persist(entries);
  };

  const setValue = (field: keyof WeekBoxValues, value: string) => {
    const save = prepareSave({ [field]: value });
    if (!save) return;
    const timer = setTimeout(() => {
      pending.delete(field);
      void save();
    }, ATTENDANCE_AUTOSAVE_DELAY);
    pending.set(field, { timer, save });
  };

  const saveValues = (changes: Partial<WeekBoxValues>) => {
    void prepareSave(changes)?.();
  };

  const flushField = (field: keyof WeekBoxValues) => {
    const task = pending.get(field);
    if (task) {
      clearTimeout(task.timer);
      pending.delete(field);
      void task.save();
    } else {
      const draft = getDrafts()[field];
      if (draft?.status === 'failed') void persist({ [field]: draft });
    }
  };

  return { values, setValue, saveValues, flushField };
};

export default useAttendanceDrafts;
