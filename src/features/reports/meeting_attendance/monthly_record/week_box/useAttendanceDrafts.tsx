import { useEffect, useMemo, useRef, useState } from 'react';
import { useSetAtom } from 'jotai';
import { ATTENDANCE_AUTOSAVE_DELAY } from '@constants/index';
import { AttendanceValues } from '@definition/meeting_attendance';
import { meetingAttendanceSaveState } from '@states/meeting_attendance';
import {
  AttendanceDraftsProps,
  AttendancePendingSave,
  WeekBoxDraft,
  WeekBoxValues,
} from '@features/reports/meeting_attendance/monthly_record/week_box/index.types';

const useAttendanceDrafts = ({
  initialValues,
  recordKey,
  disabled,
  params,
}: AttendanceDraftsProps) => {
  const saveAttendanceRecord = useSetAtom(meetingAttendanceSaveState);
  const revision = useRef(0);
  const [drafts, setDrafts] = useState<WeekBoxDraft>({
    key: recordKey,
    values: {},
  });
  const { key: pendingKey, saves: pending } = useMemo(
    () => ({
      key: recordKey,
      saves: new Map<keyof WeekBoxValues, AttendancePendingSave>(),
    }),
    [recordKey]
  );

  useEffect(() => {
    const flush = () => {
      for (const task of pending.values()) {
        clearTimeout(task.timer);
        void task.save();
      }
      pending.clear();
    };
    const handleVisibility = () => {
      if (document.visibilityState === 'hidden') flush();
    };
    window.addEventListener('pagehide', flush);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('pagehide', flush);
      document.removeEventListener('visibilitychange', handleVisibility);
      flush();
    };
  }, [pending]);

  useEffect(() => {
    setDrafts((current) => {
      if (current.key !== recordKey) return current;
      const next = { ...current.values };
      let changed = false;
      for (const field of Object.keys(next) as (keyof WeekBoxValues)[]) {
        const draft = next[field];
        if (draft?.status === 'saved' && initialValues[field] === draft.value) {
          delete next[field];
          changed = true;
        }
      }
      return changed ? { ...current, values: next } : current;
    });
  }, [drafts, initialValues, recordKey]);

  const values = useMemo(() => {
    const result = { ...initialValues };
    if (drafts.key === recordKey) {
      for (const field of Object.keys(
        drafts.values
      ) as (keyof WeekBoxValues)[]) {
        const draft = drafts.values[field];
        if (draft) result[field] = draft.value;
      }
    }
    return result;
  }, [drafts, initialValues, recordKey]);

  const prepareSave = (changes: Partial<WeekBoxValues>) => {
    const fields = Object.keys(changes) as (keyof WeekBoxValues)[];
    if (disabled || !fields.length) return;
    const currentRevision = ++revision.current;
    const entries: WeekBoxDraft['values'] = {};
    const counts: AttendanceValues = {};
    for (const field of fields) {
      clearTimeout(pending.get(field)?.timer);
      pending.delete(field);
      entries[field] = {
        value: changes[field]!,
        revision: currentRevision,
        status: 'pending',
      };
      const storedField =
        field === 'presentDeaf'
          ? 'present_deaf'
          : field === 'onlineDeaf'
            ? 'online_deaf'
            : field;
      counts[storedField] = changes[field];
    }
    setDrafts((current) => ({
      key: pendingKey,
      values: {
        ...(current.key === pendingKey ? current.values : {}),
        ...entries,
      },
    }));
    const setStatus = (status: 'saving' | 'saved' | 'failed') => {
      setDrafts((current) => {
        if (current.key !== pendingKey) return current;
        const next = { ...current.values };
        for (const field of fields) {
          const draft = next[field];
          if (draft?.revision === currentRevision) {
            next[field] = { ...draft, status };
          }
        }
        return { ...current, values: next };
      });
    };
    return async () => {
      setStatus('saving');
      const success = await saveAttendanceRecord({ ...params, values: counts });
      setStatus(success ? 'saved' : 'failed');
    };
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
    } else if (
      drafts.key === recordKey &&
      drafts.values[field]?.status === 'failed'
    ) {
      saveValues({ [field]: drafts.values[field].value });
    }
  };

  return { values, setValue, saveValues, flushField };
};

export default useAttendanceDrafts;
