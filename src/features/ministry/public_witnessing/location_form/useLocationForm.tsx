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
import { getMessageByCode } from '@services/i18n/translation';
import { LocationFormProps } from './index.types';

const WEEKDAYS = [1, 2, 3, 4, 5, 6, 7];

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
    Record<number, PublicWitnessingShiftType[]>
  >(() =>
    Object.fromEntries(
      WEEKDAYS.map((weekday) => [
        weekday,
        location?.location_data.schedule.find(
          (day) => day.weekday === weekday
        )?.shifts ?? [],
      ])
    )
  );
  const [approvedDays, setApprovedDays] = useState<number[]>(
    () => location?.location_data.schedule.map((day) => day.weekday) ?? []
  );
  const [selectedDay, setSelectedDay] = useState<number | null>(
    () => location?.location_data.schedule.at(0)?.weekday ?? null
  );

  const everyDay = approvedDays.length === WEEKDAYS.length;

  const handleToggleEveryDay = () => {
    setApprovedDays(everyDay ? [] : [...WEEKDAYS]);
  };

  // Approving a day opens its shifts; removing it closes them again — only
  // approved days have shifts to edit.
  const handleToggleDay = (weekday: number) => {
    const isApproved = approvedDays.includes(weekday);

    setApprovedDays((prev) =>
      isApproved ? prev.filter((day) => day !== weekday) : [...prev, weekday]
    );
    setSelectedDay(isApproved ? null : weekday);
  };

  const selectedShifts = selectedDay !== null ? shiftsByDay[selectedDay] : [];

  const handleAddShift = () => {
    if (selectedDay === null) return;
    const last = shiftsByDay[selectedDay].at(-1);
    const start_time = last?.end_time ?? '09:00';
    const shift: PublicWitnessingShiftType = {
      start_time,
      end_time: timeAddMinutes(start_time, 60),
    };
    setShiftsByDay((prev) => ({
      ...prev,
      [selectedDay]: [...prev[selectedDay], shift],
    }));
  };

  const handleRemoveShift = (index: number) => {
    if (selectedDay === null) return;
    setShiftsByDay((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].filter((_, i) => i !== index),
    }));
  };

  const handleShiftChange = (
    index: number,
    field: keyof PublicWitnessingShiftType,
    value: string
  ) => {
    if (selectedDay === null) return;
    setShiftsByDay((prev) => ({
      ...prev,
      [selectedDay]: prev[selectedDay].map((shift, i) =>
        i === index ? { ...shift, [field]: value } : shift
      ),
    }));
  };

  const isValid = useMemo(() => name.trim().length > 0, [name]);

  const handleSave = async () => {
    if (!isValid) return;

    const schedule: PublicWitnessingDayScheduleType[] = WEEKDAYS.filter(
      (weekday) => approvedDays.includes(weekday)
    ).map((weekday) => ({ weekday, shifts: shiftsByDay[weekday] }));

    try {
      await dbPublicWitnessingLocationsSave({
        location_uid: location?.location_uid ?? crypto.randomUUID(),
        location_data: {
          _deleted: false,
          updatedAt: new Date().toISOString(),
          name: name.trim(),
          address: address.trim(),
          cart_stored_at: cartStoredAt.trim(),
          max_publishers: maxPublishers === '' ? undefined : maxPublishers,
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
    everyDay,
    approvedDays,
    selectedDay,
    selectedShifts,
    isValid,
    handleToggleEveryDay,
    handleToggleDay,
    setSelectedDay,
    handleAddShift,
    handleRemoveShift,
    handleShiftChange,
    handleSave,
  };
};

export default useLocationForm;
