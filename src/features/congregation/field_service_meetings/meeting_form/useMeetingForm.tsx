import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import {
  fieldServiceGroupsState,
  fieldWithLanguageGroupsState,
} from '@states/field_service_groups';
import { fieldServiceMeetingsActiveState } from '@states/field_service_meetings';
import { personsByViewState, personsState } from '@states/persons';
import { formatDate } from '@utils/date';
import {
  congAddressState,
  displayNameMeetingsEnableState,
  fullnameOptionState,
  settingsState,
} from '@states/settings';
import {
  buildFieldServiceGroupLabel,
  personGetDisplayName,
} from '@utils/common';
import { AssignmentCode } from '@definition/assignment';
import {
  FieldServiceMeetingCategory,
  FieldServiceMeetingLocation,
  FieldServiceMeetingType,
  FIELD_SERVICE_MEETING_CATEGORIES,
  FIELD_SERVICE_MEETING_LOCATIONS,
  FIELD_SERVICE_MEETING_LOCATION_TRANSLATION_KEYS,
} from '@definition/field_service_meetings';
import { ConductorOption, GroupOption, LocationOption } from './index.types';
import { locationIconMap } from '../location_icons';
import useFieldServiceMeetingsPermissions from '../usePermissions';
import { getGroupRecurringStart } from '../recurring_prefill';

const DEFAULT_DURATION_MINUTES = 60;
const DEFAULT_DURATION_MS = DEFAULT_DURATION_MINUTES * 60 * 1000;

const useMeetingForm = (
  meeting: FieldServiceMeetingType,
  onSave: (meeting: FieldServiceMeetingType) => Promise<void> | void
) => {
  const { t } = useAppTranslation();
  const groups = useAtomValue(fieldWithLanguageGroupsState);
  const allGroups = useAtomValue(fieldServiceGroupsState);
  const persons = useAtomValue(personsByViewState);
  const allPersons = useAtomValue(personsState);
  const existingMeetings = useAtomValue(fieldServiceMeetingsActiveState);
  const useDisplayName = useAtomValue(displayNameMeetingsEnableState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const settings = useAtomValue(settingsState);
  const congAddress = useAtomValue(congAddressState);
  const { isAdmin, isServiceOverseer } = useFieldServiceMeetingsPermissions();

  const serviceOverseerUid =
    settings.cong_settings.responsabilities?.service ?? '';

  const [formData, setFormData] = useState<FieldServiceMeetingType>(() =>
    structuredClone(meeting)
  );
  const [saving, setSaving] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const lastMeetingUidRef = useRef(meeting.meeting_uid);

  // Only sync on a different uid: resetting on every new object with the same
  // uid would wipe in-progress edits.
  useEffect(() => {
    if (lastMeetingUidRef.current !== meeting.meeting_uid) {
      lastMeetingUidRef.current = meeting.meeting_uid;
      setFormData(structuredClone(meeting));
      setAttempted(false);
    }
  }, [meeting]);

  const meetingDuration = useMemo(() => {
    const start = new Date(formData.meeting_data.start).getTime();
    const end = new Date(formData.meeting_data.end).getTime();
    return Number.isFinite(start) && Number.isFinite(end) && end > start
      ? end - start
      : DEFAULT_DURATION_MS;
  }, [formData.meeting_data.end, formData.meeting_data.start]);

  const startDate = useMemo(
    () => new Date(formData.meeting_data.start),
    [formData.meeting_data.start]
  );

  const groupOptions = useMemo<GroupOption[]>(() => {
    const base = t('tr_group');
    const availableGroups = groups
      .filter((group) => !group.group_data._deleted)
      .map((group) => ({
        id: group.group_id,
        label: buildFieldServiceGroupLabel(
          base,
          group.group_data.sort_index + 1,
          group.group_data.name
        ),
      }));

    // Keep a since-deleted group selectable, or editing would silently turn
    // the meeting into a joint one.
    const currentGroupId = meeting.meeting_data.group_id;
    if (
      currentGroupId &&
      !availableGroups.some((option) => option.id === currentGroupId)
    ) {
      const deleted = allGroups.find(
        (group) => group.group_id === currentGroupId
      );

      availableGroups.push({
        id: currentGroupId,
        label: deleted
          ? buildFieldServiceGroupLabel(
              base,
              deleted.group_data.sort_index + 1,
              deleted.group_data.name
            )
          : base,
      });
    }

    // "main" spans all groups — labelled to match the "Joint meeting" type.
    return [
      { id: 'main', label: t('tr_fieldServiceMeetingCategory_joint') },
      ...availableGroups,
    ];
  }, [groups, allGroups, meeting.meeting_data.group_id, t]);

  const locationOptions = useMemo<LocationOption[]>(() => {
    return FIELD_SERVICE_MEETING_LOCATIONS.map((location) => ({
      value: location,
      label: t(FIELD_SERVICE_MEETING_LOCATION_TRANSLATION_KEYS[location]),
      icon: locationIconMap[location],
    }));
  }, [t]);

  // Needed to display a stored conductor outside the suggestion list.
  const allPersonOptions = useMemo<ConductorOption[]>(() => {
    return allPersons
      .map((person) => ({
        id: person.person_uid,
        label: personGetDisplayName(person, useDisplayName, fullnameOption),
      }))
      .filter((option) => option.label.trim().length > 0);
  }, [allPersons, useDisplayName, fullnameOption]);

  // Brothers holding the conductor qualification in the current view.
  const qualifiedOptions = useMemo<ConductorOption[]>(() => {
    return persons
      .filter((person) =>
        person.person_data.assignments?.some((assignment) =>
          assignment.values.includes(AssignmentCode.MINISTRY_FS_CONDUCTOR)
        )
      )
      .map((person) => ({
        id: person.person_uid,
        label: personGetDisplayName(person, useDisplayName, fullnameOption),
      }))
      .filter((option) => option.label.trim().length > 0)
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [persons, useDisplayName, fullnameOption]);

  const selectedGroup = useMemo(() => {
    const groupId =
      formData.meeting_data.group_id ?? formData.meeting_data.type ?? 'main';
    return (
      groupOptions.find((option) => option.id === groupId) ?? groupOptions[0]
    );
  }, [
    formData.meeting_data.group_id,
    formData.meeting_data.type,
    groupOptions,
  ]);

  // Qualified brothers, narrowed to the selected group. The field stays free
  // entry, so this only shapes the suggestions.
  const conductorOptions = useMemo<ConductorOption[]>(() => {
    if (selectedGroup.id === 'main') return qualifiedOptions;
    const group = groups.find((g) => g.group_id === selectedGroup.id);
    if (!group) return qualifiedOptions;
    const memberUids = new Set(
      group.group_data.members.map((member) => member.person_uid)
    );
    return qualifiedOptions.filter((option) => memberUids.has(option.id));
  }, [selectedGroup.id, groups, qualifiedOptions]);

  const conductorValue = useMemo<ConductorOption | string | null>(() => {
    const current = formData.meeting_data.conductor;
    if (!current) return null;
    return allPersonOptions.find((option) => option.id === current) ?? current;
  }, [formData.meeting_data.conductor, allPersonOptions]);

  const selectedLocation = useMemo(() => {
    return (
      locationOptions.find(
        (option) => option.value === formData.meeting_data.location
      ) ?? locationOptions[0]
    );
  }, [formData.meeting_data.location, locationOptions]);

  const isJointMeeting = useMemo(
    () =>
      formData.meeting_data.category ===
      FieldServiceMeetingCategory.JointMeeting,
    [formData.meeting_data.category]
  );

  // Only the service overseer (or an admin) may create a "Service overseer
  // visit"; a meeting's stored category always stays available for editing.
  const categoryOptions = useMemo<FieldServiceMeetingCategory[]>(() => {
    return FIELD_SERVICE_MEETING_CATEGORIES.filter((category) => {
      if (category === FieldServiceMeetingCategory.ServiceOverseerMeeting) {
        return (
          isAdmin ||
          isServiceOverseer ||
          formData.meeting_data.category === category
        );
      }
      return true;
    });
  }, [isAdmin, isServiceOverseer, formData.meeting_data.category]);

  const locationFieldLabel = useMemo(
    () =>
      formData.meeting_data.location === FieldServiceMeetingLocation.Online
        ? t('tr_joinDetails')
        : t('tr_address'),
    [formData.meeting_data.location, t]
  );

  const canSubmit = useMemo(
    () =>
      Boolean(formData.meeting_data.start) &&
      formData.meeting_data.conductor.trim().length > 0,
    [formData.meeting_data.start, formData.meeting_data.conductor]
  );

  // Another meeting at the same group, day and time — warns before saving.
  const isSimilarMeeting = useMemo(() => {
    const start = new Date(formData.meeting_data.start);
    if (Number.isNaN(start.getTime())) return false;
    const date = formatDate(start, 'yyyy/MM/dd');
    const time = formatDate(start, 'HH:mm');
    const groupId = formData.meeting_data.group_id ?? '';

    return existingMeetings.some((meeting) => {
      if (!meeting) return false;
      if (meeting.meeting_uid === formData.meeting_uid) return false;
      if (meeting.meeting_data._deleted) return false;
      if ((meeting.meeting_data.group_id ?? '') !== groupId) return false;
      const otherStart = new Date(meeting.meeting_data.start);
      return (
        formatDate(otherStart, 'yyyy/MM/dd') === date &&
        formatDate(otherStart, 'HH:mm') === time
      );
    });
  }, [
    existingMeetings,
    formData.meeting_data.start,
    formData.meeting_data.group_id,
    formData.meeting_uid,
  ]);

  const updateMeetingData = useCallback(
    (payload: Partial<FieldServiceMeetingType['meeting_data']>) => {
      setFormData((prev) => ({
        ...prev,
        meeting_data: {
          ...prev.meeting_data,
          ...payload,
        },
      }));
    },
    []
  );

  const updateStartPreservingDuration = useCallback(
    (mutate: (date: Date) => void) => {
      const base = new Date(formData.meeting_data.start);
      // An unparsable start would make toISOString() throw.
      if (Number.isNaN(base.getTime())) {
        base.setTime(Date.now());
      }
      mutate(base);
      if (Number.isNaN(base.getTime())) return;
      const newEnd = new Date(base.getTime() + meetingDuration);
      updateMeetingData({
        start: base.toISOString(),
        end: newEnd.toISOString(),
      });
    },
    [formData.meeting_data.start, meetingDuration, updateMeetingData]
  );

  const handleDateChange = useCallback(
    (value: Date | null) => {
      if (!value) return;
      updateStartPreservingDuration((d) => {
        d.setFullYear(value.getFullYear(), value.getMonth(), value.getDate());
      });
    },
    [updateStartPreservingDuration]
  );

  const handleTimeChange = useCallback(
    (value: Date | null) => {
      if (!value) return;
      updateStartPreservingDuration((d) => {
        d.setHours(value.getHours(), value.getMinutes(), 0, 0);
      });
    },
    [updateStartPreservingDuration]
  );

  const handleGroupChange = useCallback(
    (_: unknown, nextGroup: GroupOption | null) => {
      if (!nextGroup) return;

      const groupId = nextGroup.id === 'main' ? undefined : nextGroup.id;
      const payload: Partial<FieldServiceMeetingType['meeting_data']> = {
        type: nextGroup.id,
        group_id: groupId,
      };

      // Dynamically pre-fill date & time from the selected group's recurring
      // meeting time so scheduling is faster.
      const recurring = getGroupRecurringStart(
        settings,
        groupId,
        existingMeetings
      );
      if (recurring) {
        payload.start = recurring.start.toISOString();
        payload.end = recurring.end.toISOString();
      }

      updateMeetingData(payload);
    },
    [updateMeetingData, settings, existingMeetings]
  );

  const handleLocationChange = useCallback(
    (_: unknown, option: LocationOption | null) => {
      if (!option) return;

      // Pre-fill the Kingdom Hall address (when known) the first time it is
      // selected, while leaving the field fully editable afterwards.
      if (
        option.value === FieldServiceMeetingLocation.KingdomHall &&
        !formData.meeting_data.address?.trim() &&
        congAddress?.trim()
      ) {
        updateMeetingData({ location: option.value, address: congAddress });
        return;
      }

      updateMeetingData({ location: option.value });
    },
    [updateMeetingData, congAddress, formData.meeting_data.address]
  );

  const handleCategoryChange = useCallback(
    (_: unknown, category: FieldServiceMeetingCategory | null) => {
      if (category === null) return;

      // Joint meetings span all groups, so clear specific group assignment
      if (category === FieldServiceMeetingCategory.JointMeeting) {
        updateMeetingData({ category, group_id: undefined, type: 'main' });
        return;
      }

      // Service overseer meetings are conducted by the service overseer
      if (category === FieldServiceMeetingCategory.ServiceOverseerMeeting) {
        updateMeetingData({ category, conductor: serviceOverseerUid });
        return;
      }

      updateMeetingData({ category });
    },
    [updateMeetingData, serviceOverseerUid]
  );

  // Inline field error: only shown once the user has attempted to submit.
  const conductorError =
    attempted && formData.meeting_data.conductor.trim().length === 0;

  /**
   * Call before saving: marks the form as attempted (shows inline errors if
   * any required field is empty) and returns true only when all fields are
   * valid. The caller should bail out when this returns false.
   */
  const validate = useCallback((): boolean => {
    setAttempted(true);
    return canSubmit;
  }, [canSubmit]);

  const handleSave = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  }, [formData, onSave, saving]);

  return {
    formData,
    saving,
    startDate,
    groupOptions,
    locationOptions,
    conductorOptions,
    selectedGroup,
    selectedLocation,
    isJointMeeting,
    categoryOptions,
    locationFieldLabel,
    isSimilarMeeting,
    conductorValue,
    conductorError,
    updateMeetingData,
    handleDateChange,
    handleTimeChange,
    handleGroupChange,
    handleLocationChange,
    handleCategoryChange,
    validate,
    handleSave,
  };
};

export default useMeetingForm;
