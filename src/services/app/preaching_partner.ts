import {
  PreachingPartnerFilterType,
  PreachingPartnerGroupType,
  PreachingPartnerMinistryType,
  PreachingPartnerRequestType,
} from '@definition/preaching_partner';
import { PersonType } from '@definition/person';
import { formatDate, generateDateFromTime } from '@utils/date';
import { getTranslation } from '@services/i18n/translation';
import { hour24FormatState } from '@states/settings';
import { store } from '@states/index';

const MINISTRY_TYPE_KEYS: Record<PreachingPartnerMinistryType, string> = {
  [PreachingPartnerMinistryType.DoorToDoor]: 'tr_doorToDoor',
  [PreachingPartnerMinistryType.BibleStudy]: 'tr_bibleStudy',
  [PreachingPartnerMinistryType.PublicWitnessing]: 'tr_PW',
  [PreachingPartnerMinistryType.Zoom]: 'tr_ministryZoom',
  [PreachingPartnerMinistryType.Phone]: 'tr_ministryPhone',
  [PreachingPartnerMinistryType.Flexible]: 'tr_ministryFlexible',
};

const FILTER_TYPES: Partial<
  Record<PreachingPartnerFilterType, PreachingPartnerMinistryType>
> = {
  'door-to-door': PreachingPartnerMinistryType.DoorToDoor,
  'bible-study': PreachingPartnerMinistryType.BibleStudy,
  'public-witnessing': PreachingPartnerMinistryType.PublicWitnessing,
};

export const preachingPartnerTypeLabel = (
  type: PreachingPartnerMinistryType
) => {
  return getTranslation({ key: MINISTRY_TYPE_KEYS[type] });
};

export const preachingPartnerTimeLabel = (
  request: PreachingPartnerRequestType
) => {
  const { flexible, start, end } = request.request_data;

  if (flexible || !start) return getTranslation({ key: 'tr_anytime' });

  const hour24 = store.get(hour24FormatState);
  const pattern = hour24 ? 'HH:mm' : 'hh:mmaaa';

  const startLabel = formatDate(generateDateFromTime(start), pattern);

  if (!end) return startLabel;

  return `${startLabel} - ${formatDate(generateDateFromTime(end), pattern)}`;
};

// a request stays listed for the whole of its day, however late it starts
export const preachingPartnerIsPast = (
  request: PreachingPartnerRequestType
) => {
  return request.request_data.date < formatDate(new Date(), 'yyyy/MM/dd');
};

export const preachingPartnerSort = (
  requests: PreachingPartnerRequestType[]
) => {
  return requests.toSorted((a, b) => {
    const dateDiff = a.request_data.date.localeCompare(b.request_data.date);

    if (dateDiff !== 0) return dateDiff;

    // an anytime request leads the day it belongs to
    return (a.request_data.start ?? '').localeCompare(
      b.request_data.start ?? ''
    );
  });
};

export const preachingPartnerGroupByDate = (
  requests: PreachingPartnerRequestType[]
) => {
  return requests.reduce((groups: PreachingPartnerGroupType[], request) => {
    const group = groups.find(
      (record) => record.date === request.request_data.date
    );

    if (group) {
      group.requests.push(request);
      return groups;
    }

    groups.push({ date: request.request_data.date, requests: [request] });

    return groups;
  }, []);
};

export const preachingPartnerMatchesFilters = (
  request: PreachingPartnerRequestType,
  filters: PreachingPartnerFilterType[],
  persons: PersonType[]
) => {
  if (filters.length === 0 || filters.includes('all')) return true;

  const types = filters
    .map((filter) => FILTER_TYPES[filter])
    .filter((type) => type !== undefined);

  // a flexible request is open to any kind of ministry, so every type finds it
  const typeMatches =
    types.length === 0 ||
    request.request_data.type === PreachingPartnerMinistryType.Flexible ||
    types.includes(request.request_data.type);

  if (!typeMatches) return false;

  const genders = filters.filter(
    (filter) => filter === 'male' || filter === 'female'
  );

  if (genders.length === 0) return true;

  const person = persons.find(
    (record) => record.person_uid === request.request_data.person_uid
  );

  if (!person) return false;

  return genders.some((gender) => person.person_data[gender].value);
};

export const preachingPartnerBuildRequest = (
  person_uid: string
): PreachingPartnerRequestType => {
  return {
    request_uid: crypto.randomUUID(),
    request_data: {
      _deleted: false,
      updatedAt: new Date().toISOString(),
      person_uid,
      date: formatDate(new Date(), 'yyyy/MM/dd'),
      flexible: true,
      type: PreachingPartnerMinistryType.Flexible,
      comment: '',
    },
  };
};
