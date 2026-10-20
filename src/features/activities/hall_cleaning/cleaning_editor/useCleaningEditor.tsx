import { displaySnackNotification } from '@services/states/app';
import { useEffect, useMemo } from 'react';
import { hallCleaningGroupEntries } from '@utils/hall_cleaning_groups';
import { resolveHallCleaningConfig } from '@utils/hall_cleaning';
import { useAtom, useAtomValue } from 'jotai';
import { AssignmentCode } from '@definition/assignment';
import { useAppTranslation } from '@hooks/index';
import { schedulesState, selectedWeekState } from '@states/schedules';
import { hallCleaningState, userDataViewState } from '@states/settings';
import { personsByViewState } from '@states/persons';
import { fieldGroupsState } from '@states/field_service_groups';
import {
  HALL_CLEANING_CONGREGATION_PREFIX,
  HallCleaningSlotType,
  schedulesHallCleaningGroup,
  schedulesHallCleaningGroups,
  schedulesHallCleaningInfo,
  schedulesHallCleaningMode,
  schedulesHallCleaningPersons,
  schedulesHallCleaningSlots,
  schedulesHallCleaningYearlyDate,
  schedulesSetHallCleaningGroup,
  schedulesSetHallCleaningYearly,
} from '@services/app/schedules';
import {
  addDays,
  formatDate,
  getWeekDate,
  formatMediumDateWithFullMonth,
} from '@utils/date';
import useGroupSelector from '@features/congregation/field_service_groups/group_selector/useGroupSelector';
import { hallCleaningSlotLabel } from '../shared';

const CLEANING_CODES = [
  AssignmentCode.CLEANING_Hall,
  AssignmentCode.CLEANING_HallResponsible,
];

const useCleaningEditor = () => {
  const { t } = useAppTranslation();

  const [selectedWeek, setSelectedWeek] = useAtom(selectedWeekState);

  const schedules = useAtomValue(schedulesState);
  const currentConfig = useAtomValue(hallCleaningState);
  const dataView = useAtomValue(userDataViewState);
  const persons = useAtomValue(personsByViewState);
  const groups = useAtomValue(fieldGroupsState);

  const { options: groupOptions } = useGroupSelector(true, false);

  const schedule = useMemo(() => {
    return schedules.find((record) => record.weekOf === selectedWeek);
  }, [schedules, selectedWeek]);

  const config = resolveHallCleaningConfig(schedule, currentConfig);

  const weekIndex = schedules.findIndex(
    (record) => record.weekOf === selectedWeek
  );

  const weekNav = {
    back: weekIndex > 0,
    next: weekIndex !== -1 && weekIndex < schedules.length - 1,
  };

  const weekDateLocale = useMemo(() => {
    if (selectedWeek.length === 0) return '';

    return formatMediumDateWithFullMonth(selectedWeek);
  }, [selectedWeek]);

  const isRotation = (config?.rotation_groups?.value.length ?? 0) > 0;

  const mode = config ? schedulesHallCleaningMode(config) : 'group';

  const yearlyDate = schedulesHallCleaningYearlyDate(schedule, dataView);

  const weekDays = useMemo(() => {
    if (selectedWeek.length === 0) return { start: null, end: null };

    return {
      start: new Date(selectedWeek),
      end: addDays(selectedWeek, 6),
    };
  }, [selectedWeek]);

  const hasQualified = useMemo(() => {
    return persons.some((person) =>
      person.person_data.assignments
        .find((record) => record.type === dataView)
        ?.values.some((code) => CLEANING_CODES.includes(code))
    );
  }, [persons, dataView]);

  const rows = useMemo(() => {
    if (!config) return [];

    return schedulesHallCleaningSlots(config, schedule).map((slot) => {
      const selectedGroups = schedulesHallCleaningGroups(
        schedule,
        slot,
        config
      );
      const groupIds = selectedGroups
        .map((group) => group.value)
        .filter(Boolean);
      const isCongregation = groupIds.some((id) =>
        id.startsWith(HALL_CLEANING_CONGREGATION_PREFIX)
      );
      const fields = !isCongregation
        ? schedulesHallCleaningPersons(slot, config).map((field, index) => ({
            ...field,
            label: index === 0 ? t('tr_responsible') : t('tr_publisher'),
          }))
        : [];
      const allowedPersons = groupIds.length
        ? groups
            .filter((record) => groupIds.includes(record.group_id))
            .flatMap((record) =>
              record.group_data.members.map((member) => member.person_uid)
            )
        : undefined;
      const stored = hallCleaningGroupEntries(
        schedule?.hall_cleaning?.[slot]?.group,
        dataView,
        selectedGroups.length
      );
      const groupFields = selectedGroups.map((group, index) => {
        const options = groupOptions.filter(
          (option) =>
            option.value === group.value || !groupIds.includes(option.value)
        );
        if (
          group.value &&
          !options.some((option) => option.value === group.value)
        )
          options.push({
            value: group.value,
            label: stored[index]?.name ?? '',
            field_group: true,
          });
        let helper = '';
        if (isCongregation) helper = t('tr_hallCleaningCongregationNames');
        else if (group.value && isRotation && slot !== 'yearly')
          helper = t(
            group.manual
              ? 'tr_hallCleaningSetForWeek'
              : 'tr_hallCleaningFromTurns'
          );
        return {
          position: index + 1,
          label:
            selectedGroups.length > 1
              ? t('tr_hallCleaningGroupNumber', { number: index + 1 })
              : t('tr_fieldServiceGroup'),
          value: group.value,
          options,
          helper,
          canReset: group.manual && isRotation && slot !== 'yearly',
        };
      });
      return {
        slot,
        label: hallCleaningSlotLabel(slot, config, t),
        showGroup: mode !== 'persons',
        groupFields,
        fields,
        allowedPersons,
      };
    });
  }, [config, schedule, groups, groupOptions, dataView, isRotation, mode, t]);

  const handleChangeWeekBack = () => {
    if (weekNav.back) setSelectedWeek(schedules[weekIndex - 1].weekOf);
  };

  const handleChangeWeekNext = () => {
    if (weekNav.next) setSelectedWeek(schedules[weekIndex + 1].weekOf);
  };

  const saveChange = async (update: () => Promise<void>) => {
    try {
      await update();
    } catch {
      displaySnackNotification({
        header: t('tr_hallCleaningSaveFailed'),
        message: t('tr_hallCleaningSaveFailedDesc'),
        severity: 'error',
      });
    }
  };

  const handleGroupChange = async (
    slot: HallCleaningSlotType,
    value: string,
    position = 1
  ) => {
    const current = schedulesHallCleaningGroup(
      schedule,
      slot,
      config,
      position
    ).value;

    if (value === current) return;

    const option = groupOptions.find((record) => record.value === value);

    await saveChange(() =>
      schedulesSetHallCleaningGroup(
        selectedWeek,
        slot,
        value,
        option?.label ?? '',
        position
      )
    );
  };

  const handleResetGroup = async (slot: HallCleaningSlotType, position = 1) => {
    await saveChange(() =>
      schedulesSetHallCleaningGroup(selectedWeek, slot, '', '', position)
    );
  };

  const handleYearlyDateChange = async (date: Date | null) => {
    if (!date) return;

    await saveChange(() =>
      schedulesSetHallCleaningYearly(
        selectedWeek,
        formatDate(date, 'yyyy/MM/dd')
      )
    );
  };

  const handleRemoveYearly = async () => {
    await saveChange(() => schedulesSetHallCleaningYearly(selectedWeek, ''));
  };

  useEffect(() => {
    if (selectedWeek.length > 0 || schedules.length === 0 || !config) return;

    const minWeekOf = formatDate(addDays(new Date(), -6), 'yyyy/MM/dd');

    const candidates = schedules.filter((record) => record.weekOf >= minWeekOf);

    const nextToPlan = candidates.find((record) => {
      const info = schedulesHallCleaningInfo(record.weekOf);

      return info.total > 0 && info.assigned < info.total;
    });

    const nextWeek = nextToPlan ?? candidates.at(0);

    if (nextWeek) setSelectedWeek(nextWeek.weekOf);
  }, [selectedWeek, schedules, config, setSelectedWeek]);

  return {
    dataView,
    selectedWeek,
    weekDateLocale,
    isCurrentWeek: selectedWeek === formatDate(getWeekDate(), 'yyyy/MM/dd'),
    weekNav,
    weekDays,
    rows,
    period: config?.period.value,
    hasQualified: hasQualified || mode === 'group',
    hasGroups: groupOptions.length > 0,
    yearlyDate,
    handleChangeWeekBack,
    handleChangeWeekNext,
    handleGroupChange,
    handleResetGroup,
    handleYearlyDateChange,
    handleRemoveYearly,
  };
};

export default useCleaningEditor;
