import appDb from '@db/appDb';
import {
  PreachingPartnerMinistryType,
  PreachingPartnerRequestType,
} from '@definition/preaching_partner';
import { addDays, formatDate } from '@utils/date';

// Reading, validating and writing under one lock prevents stale dialogs from
// replacing another tab's edits or leaving half of an arrangement saved.
export const dbPreachingPartnerMutate = (
  transform: (
    records: PreachingPartnerRequestType[],
    activePersonIds: string[]
  ) => PreachingPartnerRequestType[]
) =>
  appDb.transaction(
    'rw',
    appDb.preaching_partner_requests,
    appDb.persons,
    async () => {
      const records = await appDb.preaching_partner_requests.toArray();
      const persons = await appDb.persons.toArray();
      const active = persons
        .filter(
          (person) =>
            !person._deleted.value && !person.person_data.archived?.value
        )
        .map((person) => person.person_uid);
      const changes = transform(records, active);
      await appDb.preaching_partner_requests.bulkPut(changes);
      return changes[0];
    }
  );

const DUMMY_REQUESTS = [
  {
    days: 2,
    flexible: false,
    start: '15:00',
    end: '17:00',
    type: PreachingPartnerMinistryType.DoorToDoor,
    comment: 'I want to do a combined ministry',
  },
  {
    days: 2,
    flexible: false,
    start: '18:00',
    type: PreachingPartnerMinistryType.Zoom,
    comment: 'I want to do a combined ministry',
  },
  {
    days: 2,
    flexible: true,
    type: PreachingPartnerMinistryType.BibleStudy,
    comment: 'I want to do a combined ministry',
  },
  {
    days: 6,
    flexible: true,
    type: PreachingPartnerMinistryType.Flexible,
    comment: 'I have some time and up to anything',
  },
  {
    days: 13,
    flexible: false,
    start: '15:00',
    type: PreachingPartnerMinistryType.PublicWitnessing,
    comment: 'I want to do a combined ministry',
  },
];

export const dbPreachingPartnerRequestsDummy = async () => {
  const settings = await appDb.app_settings.get(1);
  const userUID = settings?.user_settings.user_local_uid;

  const persons = await appDb.persons.toArray();

  const candidates = persons.filter(
    (person) =>
      !person._deleted.value &&
      !person.person_data.archived?.value &&
      person.person_uid !== userUID
  );

  if (candidates.length === 0) return;

  const requests = DUMMY_REQUESTS.map((record, index) => {
    const person = candidates[index % candidates.length];

    return {
      request_uid: crypto.randomUUID(),
      request_data: {
        _deleted: false,
        updatedAt: new Date().toISOString(),
        person_uid: person.person_uid,
        date: formatDate(addDays(new Date(), record.days), 'yyyy/MM/dd'),
        flexible: record.flexible,
        start: record.start,
        end: record.end,
        type: record.type,
        comment: record.comment,
      },
    } as PreachingPartnerRequestType;
  });

  await appDb.preaching_partner_requests.bulkPut(requests);
};
