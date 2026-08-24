import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { createEvent } from 'ics';
import { saveAs } from 'file-saver';
import { PublicWitnessingPublisherType } from '@definition/public_witnessing';
import { ShiftSlotStatus } from '../shifts_card/index.types';
import { personsActiveState } from '@states/persons';
import { fullnameOptionState, userLocalUIDState } from '@states/settings';
import { dbPublicWitnessingArrangementsSave } from '@services/dexie/public_witnessing_arrangements';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { buildPersonFullname } from '@utils/common';
import usePublicWitnessingPermissions from '../usePermissions';
import {
  ArrangementFormProps,
  ArrangementMode,
  PartnerNameType,
  PersonOption,
} from './index.types';

export const createPartnerName = (name = ''): PartnerNameType => ({
  id: crypto.randomUUID(),
  name,
});

const getMode = (
  hasExisting: boolean,
  status: ShiftSlotStatus
): ArrangementMode => {
  if (hasExisting) return 'edit';
  if (status === 'partner_needed') return 'join';
  return 'create';
};

const useArrangementForm = ({
  location,
  slot,
  onClose,
}: ArrangementFormProps) => {
  const { canManageLocations } = usePublicWitnessingPermissions();

  const persons = useAtomValue(personsActiveState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const userUID = useAtomValue(userLocalUIDState);

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

  const existing =
    slot.myArrangement ??
    (canManageLocations ? slot.arrangements.at(0) : undefined);

  const mode = getMode(Boolean(existing), slot.status);

  const [partnerNeeded, setPartnerNeeded] = useState(
    existing ? existing.arrangement_data.partner_needed : true
  );
  const [partnerCount, setPartnerCount] = useState(
    existing?.arrangement_data.partner_count ?? 1
  );
  const [partnerNames, setPartnerNames] = useState<PartnerNameType[]>(() => {
    const others = (existing?.arrangement_data.publishers ?? [])
      .filter((publisher) => publisher.person_uid !== userUID)
      .map((publisher) => createPartnerName(publisher.name));

    return others.length > 0 ? others : [createPartnerName()];
  });
  const [forOthers, setForOthers] = useState(
    existing
      ? !existing.arrangement_data.publishers.some(
          (publisher) => publisher.person_uid === userUID
        )
      : false
  );

  const capacity = location.location_data.max_publishers;

  // Seats other people already hold in this shift. An edit does not count its
  // own record — those seats are the ones being re-arranged.
  const takenByOthers = slot.arrangements
    .filter((record) => record.arrangement_uid !== existing?.arrangement_uid)
    .reduce(
      (total, record) => total + record.arrangement_data.publishers.length,
      0
    );

  const seatsLeft = Math.max(0, capacity - takenByOthers);

  const maxNames = forOthers ? seatsLeft : Math.max(0, seatsLeft - 1);

  const canInvitePartners = maxNames > 0;

  const names = partnerNames.slice(0, maxNames);

  const buildPublishers = (): PublicWitnessingPublisherType[] => {
    const toPublisher = (name: string): PublicWitnessingPublisherType => {
      const match = personOptions.find((option) => option.label === name);
      return match ? { name, person_uid: match.id } : { name };
    };

    const named = names
      .map((partner) => partner.name.trim())
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
          date: slot.date,
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
    if (seatsLeft === 0) return false;

    if (mode === 'join') {
      return handleSave({
        partner_needed: false,
        publishers: [{ name: myName, person_uid: userUID }],
      });
    }

    const seekingPartner = !forOthers && canInvitePartners && partnerNeeded;

    return handleSave({
      partner_needed: seekingPartner,
      partner_count: seekingPartner
        ? Math.min(partnerCount, maxNames)
        : undefined,
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
    const [year, month, day] = slot.date.split('/').map(Number);
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

          displaySnackNotification({
            header: getMessageByCode('error_app_generic-title'),
            message: getMessageByCode(error.message),
            severity: 'error',
          });

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
    partnerNames: names,
    setPartnerNames,
    forOthers,
    setForOthers,
    maxNames,
    canInvitePartners,
    personOptions,
    handleConfirm,
    handleDelete,
    handleDownloadCalendar,
  };
};

export default useArrangementForm;
