import { PersonType } from '@definition/person';
import { arrayInCsvSeparator } from './csvFiles';

export const stringAddEmergencyContacts = (
  newPerson: PersonType,
  emergency_contacts: string
) => {
  if (!emergency_contacts || !emergency_contacts.trim()) {
    return;
  }

  if (!newPerson.person_data?.emergency_contacts) {
    return;
  }
  const contactsArray = emergency_contacts.split(arrayInCsvSeparator());

  for (const item of contactsArray) {
    const trimmedItem = item.trim();
    if (!trimmedItem || !trimmedItem.includes(':')) {
      continue;
    }

    const [nameRaw = '', contactRaw = ''] = trimmedItem.split(':', 2);
    const name = nameRaw.trim();
    const contact = contactRaw.trim();

    if (!name || !contact) {
      continue;
    }

    newPerson.person_data.emergency_contacts.push({
      id: crypto.randomUUID(),
      _deleted: false,
      updatedAt: new Date().toISOString(),
      name,
      contact,
    });
  }
};
