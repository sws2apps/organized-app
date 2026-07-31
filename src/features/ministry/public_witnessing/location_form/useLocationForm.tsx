import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import {
  PublicWitnessingDayScheduleType,
  PublicWitnessingShiftType,
} from '@definition/public_witnessing';
import { publicWitnessingLocationsState } from '@states/public_witnessing';
import { dbPublicWitnessingLocationsSave } from '@services/dexie/public_witnessing_locations';
import { timeAddMinutes } from '@utils/date';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode, getTranslation } from '@services/i18n/translation';
import {
  EditableShiftType,
  LocationFormProps,
  ScheduleMode,
} from './index.types';

const WEEKDAYS = [1, 2, 3, 4, 5, 6, 7];

const toEditable = (shift: PublicWitnessingShiftType): EditableShiftType => ({
  ...shift,
  id: crypto.randomUUID(),
});

const useLocationForm = ({ location, onClose }: LocationFormProps) => {
  const locations = useAtomValue(publicWitnessingLocationsState);

  const [name, setName] = useState(location?.location_data.name ?? '');
  const [address, setAddress] = useState(location?.location_data.address ?? '');
  const [cartStoredAt, setCartStoredAt] = useState(
    location?.location_data.cart_stored_at ?? ''
  );
  const [maxPublishers, setMaxPublishers] = useState<number | ''>(
    location?.location_data.max_publishers ?? ''
  );
  const [description, setDescription] = useState(
    location?.location_data.description ?? ''
  );

  // Shifts are kept per weekday even for unchecked days, so toggling a day
  // off and on again does not lose its shifts before saving.
  const [shiftsByDay, setShiftsByDay] = useState<
    Record<number, EditableShiftType[]>
  >(() =>
    Object.fromEntries(
      WEEKDAYS.map((weekday) => [
        weekday,
        (
          location?.location_data.schedule.find(
            (day) => day.weekday === weekday
          )?.shifts ?? []
        ).map(toEditable),
      ])
    )
  );
  const [approvedDays, setApprovedDays] = useState<number[]>(
    () => location?.location_data.schedule.map((day) => day.weekday) ?? []
  );
  const [selectedDay, setSelectedDay] = useState<number | null>(
    () => location?.location_data.schedule.at(0)?.weekday ?? null
  );

  // Details / schedule — shown as steps when adding a location, as tabs when
  // editing one.
  const [step, setStep] = useState(0);

  // Missing details are only marked once the publisher tried to move on
  // without them.
  const [showErrors, setShowErrors] = useState(false);

  const [isSaving, setIsSaving] = useState(false);

  const [scheduleMode, setScheduleMode] = useState<ScheduleMode>(() => {
    const schedule = location?.location_data.schedule;
    if (schedule?.length !== WEEKDAYS.length) return 'custom';

    const template = JSON.stringify(schedule[0].shifts);
    const sameEveryDay = schedule.every(
      (day) => JSON.stringify(day.shifts) === template
    );

    return sameEveryDay ? 'every_day' : 'custom';
  });

  const isEveryDay = scheduleMode === 'every_day';

  const handleScheduleModeChange = (mode: ScheduleMode) => {
    setScheduleMode(mode);

    if (mode === 'custom') {
      setSelectedDay(approvedDays.at(0) ?? null);
      return;
    }

    const template = shiftsByDay[selectedDay ?? WEEKDAYS[0]] ?? [];

    setApprovedDays([...WEEKDAYS]);
    setShiftsByDay(
      Object.fromEntries(
        WEEKDAYS.map((weekday) => [weekday, template.map(toEditable)])
      )
    );
    setSelectedDay(null);
  };

  const handleToggleDay = (weekday: number) => {
    const isApproved = approvedDays.includes(weekday);

    setApprovedDays((prev) =>
      isApproved ? prev.filter((day) => day !== weekday) : [...prev, weekday]
    );

    if (!isApproved) {
      setSelectedDay(weekday);
      return;
    }

    // Unchecking a day only closes the editor when it is the one open.
    if (weekday === selectedDay) setSelectedDay(null);
  };

  const getEditedDays = () => {
    if (isEveryDay) return WEEKDAYS;
    return selectedDay === null ? [] : [selectedDay];
  };

  const editedDays = getEditedDays();

  const selectedShifts = isEveryDay
    ? shiftsByDay[WEEKDAYS[0]]
    : (shiftsByDay[selectedDay ?? 0] ?? []);

  const updateShifts = (
    updater: (shifts: EditableShiftType[]) => EditableShiftType[]
  ) => {
    if (editedDays.length === 0) return;

    setShiftsByDay((prev) => {
      const next = { ...prev };
      for (const weekday of editedDays) next[weekday] = updater(prev[weekday]);
      return next;
    });
  };

  const handleAddShift = () => {
    updateShifts((shifts) => {
      const start_time = shifts.at(-1)?.end_time ?? '09:00';
      return [
        ...shifts,
        toEditable({ start_time, end_time: timeAddMinutes(start_time, 60) }),
      ];
    });
  };

  const handleRemoveShift = (index: number) => {
    updateShifts((shifts) => shifts.filter((_, i) => i !== index));
  };

  const handleShiftChange = (
    index: number,
    field: keyof PublicWitnessingShiftType,
    value: string
  ) => {
    updateShifts((shifts) =>
      shifts.map((shift, i) =>
        i === index ? { ...shift, [field]: value } : shift
      )
    );
  };

  const errors = {
    name: showErrors && name.trim().length === 0,
    maxPublishers: showErrors && !(Number(maxPublishers) > 0),
  };

  const isDetailsValid = useMemo(
    () => name.trim().length > 0 && Number(maxPublishers) > 0,
    [name, maxPublishers]
  );

  const handleNext = () => {
    if (!isDetailsValid) {
      setShowErrors(true);
      return;
    }

    setStep(1);
  };

  const handleSave = async () => {
    if (isSaving) return;

    if (!isDetailsValid) {
      setShowErrors(true);
      setStep(0);
      return;
    }

    // "HH:mm" compares as text, so a plain comparison catches shifts that end
    // before they start — those would never show up as a slot.
    const hasInvalidShift = approvedDays.some((weekday) =>
      shiftsByDay[weekday].some((shift) => shift.end_time <= shift.start_time)
    );

    if (hasInvalidShift) {
      setStep(1);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getTranslation({ key: 'tr_shiftEndsBeforeStart' }),
        severity: 'error',
      });

      return;
    }

    const schedule: PublicWitnessingDayScheduleType[] = WEEKDAYS.filter(
      (weekday) => approvedDays.includes(weekday)
    ).map((weekday) => ({
      weekday,
      shifts: shiftsByDay[weekday].map(({ start_time, end_time }) => ({
        start_time,
        end_time,
      })),
    }));

    setIsSaving(true);

    try {
      await dbPublicWitnessingLocationsSave({
        location_uid: location?.location_uid ?? crypto.randomUUID(),
        location_data: {
          _deleted: false,
          updatedAt: new Date().toISOString(),
          name: name.trim(),
          address: address.trim(),
          cart_stored_at: cartStoredAt.trim(),
          max_publishers: Number(maxPublishers),
          description: description.trim(),
          sort_index: location?.location_data.sort_index ?? locations.length,
          schedule,
        },
      });

      onClose();
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    name,
    setName,
    address,
    setAddress,
    cartStoredAt,
    setCartStoredAt,
    maxPublishers,
    setMaxPublishers,
    description,
    setDescription,
    scheduleMode,
    handleScheduleModeChange,
    approvedDays,
    selectedDay,
    selectedShifts,
    errors,
    isSaving,
    step,
    setStep,
    handleNext,
    handleToggleDay,
    setSelectedDay,
    handleAddShift,
    handleRemoveShift,
    handleShiftChange,
    handleSave,
  };
};

export default useLocationForm;
