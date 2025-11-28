import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { fieldWithLanguageGroupsState } from '@states/field_service_groups';
import { personsActiveState } from '@states/persons';
import {
  FieldServiceMeetingCategory,
  FieldServiceMeetingLocation,
  FieldServiceMeetingType,
  FIELD_SERVICE_MEETING_LOCATIONS,
  FIELD_SERVICE_MEETING_LOCATION_TRANSLATION_KEYS,
} from '@definition/field_service_meetings';
import type { GroupOption, LocationOption } from '../index.types';
import { locationIconMap } from '../locationIcons';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_DURATION_MINUTES = 60;
const DEFAULT_DURATION_MS = DEFAULT_DURATION_MINUTES * 60 * 1000;

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * useMeetingForm
 *
 * Encapsulates all form logic for field service meeting creation/editing:
 * - Draft state management with upstream sync
 * - Computed options (groups, locations, persons)
 * - Duration-aware datetime mutations
 * - Category-aware group clearing (Joint meetings)
 * - Form validation and save orchestration
 */
const useMeetingForm = (
  meeting: FieldServiceMeetingType,
  onSave: (meeting: FieldServiceMeetingType) => Promise<void> | void
) => {
  const { t } = useAppTranslation();
  const groups = useAtomValue(fieldWithLanguageGroupsState);
  const persons = useAtomValue(personsActiveState);

  // -------------------------------------------------------------------------
  // State Management
  // -------------------------------------------------------------------------

  const [formData, setFormData] = useState<FieldServiceMeetingType>(() =>
    structuredClone(meeting)
  );
  const [saving, setSaving] = useState(false);
  const lastMeetingUidRef = useRef(meeting.meeting_uid);

  // Sync with upstream meeting changes
  useEffect(() => {
    if (lastMeetingUidRef.current === meeting.meeting_uid) {
      setFormData(structuredClone(meeting));
    } else {
      lastMeetingUidRef.current = meeting.meeting_uid;
      setFormData(structuredClone(meeting));
    }
  }, [meeting]);

  // -------------------------------------------------------------------------
  // Computed Values & Options
  // -------------------------------------------------------------------------

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
    const availableGroups = groups
      .filter((group) => !group.group_data._deleted)
      .map((group, index) => {
        const base = t('tr_group');
        const name = group.group_data.name?.trim();
        const displayName = name
          ? `${base} ${index + 1} - ${name}`
          : `${base} ${index + 1}`;
        return {
          id: group.group_id,
          label: displayName,
        } as GroupOption;
      });

    return [{ id: 'main', label: t('tr_all') }, ...availableGroups];
  }, [groups, t]);

  const locationOptions = useMemo<LocationOption[]>(() => {
    return FIELD_SERVICE_MEETING_LOCATIONS.map((location) => ({
      value: location,
      label: t(FIELD_SERVICE_MEETING_LOCATION_TRANSLATION_KEYS[location]),
      icon: locationIconMap[location],
    }));
  }, [t]);

  const personOptions = useMemo(() => {
    const names = new Set<string>();

    for (const person of persons) {
      const lastName = person.person_data.person_lastname.value?.trim() ?? '';
      const firstName = person.person_data.person_firstname.value?.trim() ?? '';
      const combined = `${lastName} ${firstName}`.trim();
      if (combined.length > 0) names.add(combined);
    }

    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [persons]);

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

  // Conductor options: only group members when specific group selected; otherwise all persons.
  const conductorOptions = useMemo(() => {
    if (selectedGroup.id === 'main') return personOptions;
    const group = groups.find((g) => g.group_id === selectedGroup.id);
    if (!group) return personOptions;
    const memberNames = new Set<string>();
    for (const member of group.group_data.members) {
      const person = persons.find((p) => p.person_uid === member.person_uid);
      if (!person) continue;
      const lastName = person.person_data.person_lastname.value?.trim() ?? '';
      const firstName = person.person_data.person_firstname.value?.trim() ?? '';
      const combined = `${lastName} ${firstName}`.trim();
      if (combined.length > 0) memberNames.add(combined);
    }
    return Array.from(memberNames).sort((a, b) => a.localeCompare(b));
  }, [selectedGroup.id, groups, persons, personOptions]);

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

  const locationFieldLabel = useMemo(
    () =>
      formData.meeting_data.location === FieldServiceMeetingLocation.Zoom
        ? t('tr_joinInfo')
        : t('tr_address'),
    [formData.meeting_data.location, t]
  );

  const canSubmit = useMemo(
    () =>
      Boolean(formData.meeting_data.start) &&
      formData.meeting_data.conductor.trim().length > 0,
    [formData.meeting_data.start, formData.meeting_data.conductor]
  );

  // -------------------------------------------------------------------------
  // Event Handlers
  // -------------------------------------------------------------------------

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
      mutate(base);
      const newEnd = new Date(base.getTime() + meetingDuration);
      updateMeetingData({
        start: base.toISOString(),
        end: newEnd.toISOString(),
      });
    },
    [formData.meeting_data.start, meetingDuration, updateMeetingData]
  );

  // Ensure conductor value remains valid when restricting to group members
  useEffect(() => {
    if (selectedGroup.id === 'main') return; // unrestricted
    const current = formData.meeting_data.conductor.trim();
    if (current.length === 0) return;
    if (conductorOptions.includes(current)) return;
    updateMeetingData({ conductor: '' });
  }, [
    selectedGroup.id,
    formData.meeting_data.conductor,
    updateMeetingData,
    conductorOptions,
  ]);

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
      updateMeetingData({
        type: nextGroup.id,
        group_id: nextGroup.id === 'main' ? undefined : nextGroup.id,
      });
    },
    [updateMeetingData]
  );

  const handleLocationChange = useCallback(
    (_: unknown, option: LocationOption | null) => {
      if (!option) return;
      updateMeetingData({ location: option.value });
    },
    [updateMeetingData]
  );

  const handleCategoryChange = useCallback(
    (_: unknown, category: FieldServiceMeetingCategory | null) => {
      if (category === null) return;

      // Joint meetings span all groups, so clear specific group assignment
      if (category === FieldServiceMeetingCategory.JointMeeting) {
        updateMeetingData({ category, group_id: undefined, type: 'main' });
        return;
      }

      updateMeetingData({ category });
    },
    [updateMeetingData]
  );

  const handleSave = useCallback(async () => {
    if (saving) return;
    setSaving(true);
    try {
      await onSave(formData);
    } finally {
      setSaving(false);
    }
  }, [formData, onSave, saving]);

  // -------------------------------------------------------------------------
  // Return API
  // -------------------------------------------------------------------------

  return {
    // State
    formData,
    saving,

    // Computed values
    startDate,
    groupOptions,
    locationOptions,
    conductorOptions,
    selectedGroup,
    selectedLocation,
    isJointMeeting,
    locationFieldLabel,
    canSubmit,

    // Handlers
    updateMeetingData,
    handleDateChange,
    handleTimeChange,
    handleGroupChange,
    handleLocationChange,
    handleCategoryChange,
    handleSave,
  };
};

export default useMeetingForm;
