import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { createEvent } from 'ics';
import { saveAs } from 'file-saver';
import { PublicWitnessingPublisherType } from '@definition/public_witnessing';
import { personsActiveState } from '@states/persons';
import { fullnameOptionState, userLocalUIDState } from '@states/settings';
import { publicWitnessingSelectedDateState } from '@states/public_witnessing';
import { dbPublicWitnessingArrangementsSave } from '@services/dexie/public_witnessing_arrangements';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { buildPersonFullname } from '@utils/common';
import usePublicWitnessingPermissions from '../usePermissions';
import { ArrangementFormProps, PersonOption } from './index.types';

const useArrangementForm = ({
  location,
  slot,
  onClose,
}: ArrangementFormProps) => {
  const { canManageLocations } = usePublicWitnessingPermissions();

  const persons = useAtomValue(personsActiveState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const userUID = useAtomValue(userLocalUIDState);
  const selectedDate = useAtomValue(publicWitnessingSelectedDateState);

  const personOptions = useMemo<PersonOption[]>(
    () =>
      persons.map((person) => ({
        id: person.person_uid,
        label: buildPersonFullname(
          person.person_data.person_lastname.value,
          person.person_data.person_firstname.value,
          fullnameOption
        ),
      })),
    [persons, fullnameOption]
  );

  const myName =
    personOptions.find((option) => option.id === userUID)?.label ?? '';

  // The arrangement being changed: the user's own, or — for admins — the
  // slot's existing arrangement.
  const existing =
    slot.myArrangement ??
    (canManageLocations ? slot.arrangements.at(0) : undefined);

  const mode: 'create' | 'join' | 'edit' = existing
    ? 'edit'
    : slot.status === 'partner_needed'
      ? 'join'
      : 'create';

  const [partnerNeeded, setPartnerNeeded] = useState(
    existing ? existing.arrangement_data.partner_needed : true
  );
  const [partnerCount, setPartnerCount] = useState(
    existing?.arrangement_data.partner_count ?? 1
  );
  // Names beside the author (have-partner mode), or all names (for others).
  const [partnerNames, setPartnerNames] = useState<string[]>(() => {
    if (!existing) return [''];
    const others = existing.arrangement_data.publishers
      .filter((publisher) => publisher.person_uid !== userUID)
      .map((publisher) => publisher.name);
    return others.length > 0 ? others : [''];
  });
  const [forOthers, setForOthers] = useState(
    existing
      ? !existing.arrangement_data.publishers.some(
          (publisher) => publisher.person_uid === userUID
        )
      : false
  );

  // Unset max falls back to the default shift capacity of 3 publishers.
  const maxPartners = Math.max(
    1,
    (location.location_data.max_publishers ?? 3) - 1
  );

  const buildPublishers = (): PublicWitnessingPublisherType[] => {
    const toPublisher = (name: string): PublicWitnessingPublisherType => {
      const match = personOptions.find((option) => option.label === name);
      return match ? { name, person_uid: match.id } : { name };
    };

    const named = partnerNames
      .map((name) => name.trim())
      .filter((name) => name.length > 0)
      .map(toPublisher);

    if (forOthers) return named;
    if (partnerNeeded) return [{ name: myName, person_uid: userUID }];
    return [{ name: myName, person_uid: userUID }, ...named];
  };

  const handleSave = async (arrangement: {
    partner_needed: boolean;
    partner_count?: number;
    publishers: PublicWitnessingPublisherType[];
  }) => {
    try {
      await dbPublicWitnessingArrangementsSave({
        arrangement_uid: existing?.arrangement_uid ?? crypto.randomUUID(),
        arrangement_data: {
          _deleted: false,
          updatedAt: new Date().toISOString(),
          location_uid: location.location_uid,
          date: selectedDate,
          start_time: slot.start_time,
          end_time: slot.end_time,
          created_by: existing?.arrangement_data.created_by ?? userUID,
          ...arrangement,
        },
      });
      return true;
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
      return false;
    }
  };

  const handleConfirm = async () => {
    if (mode === 'join') {
      // Joining never touches the seeker's record — the slot state is
      // derived, so separate records merge cleanly on sync.
      return handleSave({
        partner_needed: false,
        publishers: [{ name: myName, person_uid: userUID }],
      });
    }

    return handleSave({
      partner_needed: forOthers ? false : partnerNeeded,
      partner_count: !forOthers && partnerNeeded ? partnerCount : undefined,
      publishers: buildPublishers(),
    });
  };

  const handleDelete = async () => {
    if (!existing) return;
    try {
      const record = structuredClone(existing);
      record.arrangement_data._deleted = true;
      record.arrangement_data.updatedAt = new Date().toISOString();

      await dbPublicWitnessingArrangementsSave(record);

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

  const handleDownloadCalendar = () => {
    const [year, month, day] = selectedDate.split('/').map(Number);
    const [startHour, startMinute] = slot.start_time.split(':').map(Number);
    const [endHour, endMinute] = slot.end_time.split(':').map(Number);

    createEvent(
      {
        title: location.location_data.name,
        description: location.location_data.description,
        location: location.location_data.address,
        start: [year, month, day, startHour, startMinute],
        end: [year, month, day, endHour, endMinute],
      },
      (error, value) => {
        if (error) {
          console.error(error);
          return;
        }
        saveAs(
          new Blob([value], { type: 'text/calendar;charset=utf-8' }),
          'public_witnessing.ics'
        );
      }
    );
  };

  return {
    mode,
    isAdmin: canManageLocations,
    partnerNeeded,
    setPartnerNeeded,
    partnerCount,
    setPartnerCount,
    partnerNames,
    setPartnerNames,
    forOthers,
    setForOthers,
    maxPartners,
    personOptions,
    handleConfirm,
    handleDelete,
    handleDownloadCalendar,
  };
};

export default useArrangementForm;
