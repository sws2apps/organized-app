import { useEffect, useRef, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { ScheduleItemType } from './index.types';
import {
  outgoingSongSelectorOpenState,
  schedulesState,
} from '@states/schedules';
import { dbSchedUpdate } from '@services/dexie/schedules';
import { congAccountConnectedState, countriesState } from '@states/app';
import {
  formatDate,
  generateDateFromTime,
  removeSecondsFromTime,
} from '@utils/date';
import { CongregationResponseType, CountryResponseType } from '@definition/api';

const useScheduleItem = ({ schedule, week }: ScheduleItemType) => {
  const timer = useRef<NodeJS.Timeout>(undefined);

  const [songSelectorOpen, setSongSelectorOpen] = useAtom(
    outgoingSongSelectorOpenState
  );

  const schedules = useAtomValue(schedulesState);
  const congConnected = useAtomValue(congAccountConnectedState);
  const countries = useAtomValue(countriesState);

  const use24hFormat = true;

  const [country, setCountry] = useState<CountryResponseType>(null);
  const [congName, setCongName] = useState('');
  const [congAddress, setCongAddress] = useState('');
  const [meetingDay, setMeetingDay] = useState<string | number>('');
  const [meetingTime, setMeetingTime] = useState<Date>(null);
  const [clearAll, setClearAll] = useState(false);
  const [isDelete, setIsDelete] = useState(false);

  const congregationFullname = `${schedule.congregation.name}${schedule.congregation.number.length > 0 ? ` (${schedule.congregation.number})` : ''}`;

  const weekSchedule = schedules.find((record) => record.weekOf === week);

  const handleCloseSongSelector = () => setSongSelectorOpen(false);

  const handleCountryChange = async (value: CountryResponseType) => {
    setCountry(value);

    const outgoingTalks = structuredClone(
      weekSchedule.weekend_meeting.outgoing_talks
    );

    const outgoingSchedule = outgoingTalks.find(
      (record) => record.id === schedule.id
    );

    outgoingSchedule.updatedAt = new Date().toISOString();
    outgoingSchedule.congregation.country = value?.countryCode || '';

    await dbSchedUpdate(week, {
      'weekend_meeting.outgoing_talks': outgoingTalks,
    });
  };

  const handleCongNameChange = (value: string) => setCongName(value);

  const handleCongNameSave = () => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(handleCongNameSaveDb, 1000);
  };

  const handleCongNameSaveDb = async () => {
    const outgoingTalks = structuredClone(
      weekSchedule.weekend_meeting.outgoing_talks
    );

    const outgoingSchedule = outgoingTalks.find(
      (record) => record.id === schedule.id
    );

    outgoingSchedule.updatedAt = new Date().toISOString();
    outgoingSchedule.congregation.name = congName;

    await dbSchedUpdate(week, {
      'weekend_meeting.outgoing_talks': outgoingTalks,
    });
  };

  const handleCongAddressChange = (value: string) => setCongAddress(value);

  const handleCongAddressSave = () => {
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(handleCongAddressSaveDb, 1000);
  };

  const handleCongAddressSaveDb = async () => {
    const outgoingTalks = structuredClone(
      weekSchedule.weekend_meeting.outgoing_talks
    );

    const outgoingSchedule = outgoingTalks.find(
      (record) => record.id === schedule.id
    );

    outgoingSchedule.updatedAt = new Date().toISOString();
    outgoingSchedule.congregation.address = congAddress;

    await dbSchedUpdate(week, {
      'weekend_meeting.outgoing_talks': outgoingTalks,
    });
  };

  const handleMeetingDayChange = async (value: number) => {
    const outgoingTalks = structuredClone(
      weekSchedule.weekend_meeting.outgoing_talks
    );

    const outgoingSchedule = outgoingTalks.find(
      (record) => record.id === schedule.id
    );

    outgoingSchedule.updatedAt = new Date().toISOString();
    outgoingSchedule.congregation.weekday = value;

    await dbSchedUpdate(week, {
      'weekend_meeting.outgoing_talks': outgoingTalks,
    });
  };

  const handleMeetingTimeChange = async (value: Date) => {
    const outgoingTalks = structuredClone(
      weekSchedule.weekend_meeting.outgoing_talks
    );

    const outgoingSchedule = outgoingTalks.find(
      (record) => record.id === schedule.id
    );

    outgoingSchedule.updatedAt = new Date().toISOString();
    outgoingSchedule.congregation.time = formatDate(value, 'HH:mm');

    await dbSchedUpdate(week, {
      'weekend_meeting.outgoing_talks': outgoingTalks,
    });
  };

  const handleOpenClearAll = () => setClearAll(true);

  const handleCloseClearAll = () => setClearAll(false);

  const handleOpenDelete = () => setIsDelete(true);

  const handleCloseDelete = () => setIsDelete(false);

  const handleSelectCongregation = async (value: CongregationResponseType) => {
    const outgoingTalks = structuredClone(
      weekSchedule.weekend_meeting.outgoing_talks
    );

    const outgoingSchedule = outgoingTalks.find(
      (record) => record.id === schedule.id
    );

    outgoingSchedule.congregation.address = value?.address || '';
    outgoingSchedule.congregation.name = value?.congName || '';
    outgoingSchedule.congregation.weekday =
      value?.weekendMeetingTime.weekday || undefined;
    outgoingSchedule.congregation.time = value
      ? removeSecondsFromTime(value.weekendMeetingTime.time)
      : '';
    outgoingSchedule.updatedAt = new Date().toISOString();

    await dbSchedUpdate(week, {
      'weekend_meeting.outgoing_talks': outgoingTalks,
    });
  };

  const handleCongSearchOverride = async (value: string) => {
    const outgoingTalks = structuredClone(
      weekSchedule.weekend_meeting.outgoing_talks
    );

    const outgoingSchedule = outgoingTalks.find(
      (record) => record.id === schedule.id
    );

    outgoingSchedule.updatedAt = new Date().toISOString();
    outgoingSchedule.congregation.name = value;

    await dbSchedUpdate(week, {
      'weekend_meeting.outgoing_talks': outgoingTalks,
    });
  };

  useEffect(() => {
    if (weekSchedule) {
      const outgoingSchedule = weekSchedule.weekend_meeting.outgoing_talks.find(
        (record) => record.id === schedule.id
      );

      // for manual entry
      setCongName(outgoingSchedule?.congregation.name || '');
      setCongAddress(outgoingSchedule?.congregation.address || '');
      setMeetingDay(outgoingSchedule?.congregation.weekday || '');

      setMeetingTime(
        outgoingSchedule?.congregation.time.length > 0
          ? generateDateFromTime(outgoingSchedule.congregation.time)
          : null
      );

      // using jw search
      const country = outgoingSchedule?.congregation.country;

      const findCountry = countries.find(
        (record) => record.countryCode === country
      );

      setCountry(findCountry ?? null);
    }
  }, [weekSchedule, schedule, countries]);

  return {
    congName,
    week,
    schedule,
    handleCountryChange,
    country,
    congConnected,
    congregationFullname,
    handleCongNameChange,
    handleCongNameSave,
    use24hFormat,
    congAddress,
    handleCongAddressChange,
    handleCongAddressSave,
    meetingDay,
    handleMeetingDayChange,
    handleMeetingTimeChange,
    meetingTime,
    handleOpenClearAll,
    handleCloseClearAll,
    clearAll,
    isDelete,
    handleOpenDelete,
    handleCloseDelete,
    handleSelectCongregation,
    handleCongSearchOverride,
    songSelectorOpen,
    handleCloseSongSelector,
  };
};

export default useScheduleItem;
