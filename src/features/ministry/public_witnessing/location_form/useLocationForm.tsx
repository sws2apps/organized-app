import { useMemo, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import {
  PublicWitnessingDayScheduleType,
  PublicWitnessingShiftType,
} from '@definition/public_witnessing';
import { publicWitnessingLocationsState } from '@states/public_witnessing';
import { publicWitnessingSaveLocationState } from '@states/public_witnessing';
import {
  publicWitnessingNextShift,
  publicWitnessingShiftError,
} from '@utils/public_witnessing';
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
  const saveLocation = useSetAtom(publicWitnessingSaveLocationState);

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

    // with every day collapsed, copy the first scheduled day, not Monday
    const templateDay =
      selectedDay ??
      (approvedDays.length > 0 ? Math.min(...approvedDays) : WEEKDAYS[0]);
    const template = shiftsByDay[templateDay] ?? [];

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
      return [...shifts, toEditable(publicWitnessingNextShift(shifts))];
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
    maxPublishers: showErrors && Number(maxPublishers) <= 0,
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

    const invalidDay = approvedDays.find((weekday) =>
      publicWitnessingShiftError(shiftsByDay[weekday])
    );

    if (invalidDay !== undefined) {
      setStep(1);
      if (!isEveryDay) setSelectedDay(invalidDay);
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getTranslation({
          key: publicWitnessingShiftError(shiftsByDay[invalidDay]),
        }),
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
      await saveLocation({
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
        message: getMessageByCode((error as Error).message),
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
