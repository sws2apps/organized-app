import { PersonType } from '@definition/person';
import { arrayInCsvSeparator } from './csvFiles';

export const stringAddEmergencyContacts = (
  newPerson: PersonType,
  emergency_contacts: string
) => {
  const contactsArray = emergency_contacts.split(arrayInCsvSeparator());

  for (const item of contactsArray) {
    const [nameRaw = '', contactRaw = ''] = item.split(':', 2);
    newPerson.person_data.emergency_contacts.push({
      id: crypto.randomUUID(),
      _deleted: false,
      updatedAt: new Date().toISOString(),
      name: nameRaw.trim(),
      contact: contactRaw.trim(),
    });
  }
};
