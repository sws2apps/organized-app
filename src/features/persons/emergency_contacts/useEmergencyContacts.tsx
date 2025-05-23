import { useParams } from 'react-router';
import { useAtomValue } from 'jotai';
import { personCurrentDetailsState } from '@states/persons';
import { setPersonCurrentDetails } from '@services/states/persons';

const useEmergencyContacts = () => {
  const { id } = useParams();
  const isAddPerson = id === undefined;

  const person = useAtomValue(personCurrentDetailsState);

  const activeContacts = person.person_data.emergency_contacts.filter(
    (record) => record._deleted === false
  );

  const handleAddContact = async () => {
    const newPerson = structuredClone(person);

    newPerson.person_data.emergency_contacts.push({
      id: crypto.randomUUID(),
      _deleted: false,
      updatedAt: '',
      name: '',
      contact: '',
    });

    setPersonCurrentDetails(newPerson);
  };

  const handleDeleteContact = async (id: string) => {
    const newPerson = structuredClone(person);

    if (!isAddPerson) {
      const current = newPerson.person_data.emergency_contacts.find(
        (contact) => contact.id === id
      );

      current._deleted = true;
      current.updatedAt = new Date().toISOString();
    }

    if (isAddPerson) {
      newPerson.person_data.emergency_contacts =
        newPerson.person_data.emergency_contacts.filter(
          (contact) => contact.id !== id
        );
    }

    setPersonCurrentDetails(newPerson);
  };

  const handleNameChange = async (id: string, value: string) => {
    const newPerson = structuredClone(person);

    const current = newPerson.person_data.emergency_contacts.find(
      (contact) => contact.id === id
    );
    current.name = value;
    current.updatedAt = new Date().toISOString();

    setPersonCurrentDetails(newPerson);
  };

  const handleContactChange = async (id: string, value: string) => {
    const newPerson = structuredClone(person);

    const current = newPerson.person_data.emergency_contacts.find(
      (history) => history.id === id
    );

    current.contact = value;
    current.updatedAt = new Date().toISOString();

    setPersonCurrentDetails(newPerson);
  };

  return {
    handleAddContact,
    handleDeleteContact,
    handleNameChange,
    handleContactChange,
    activeContacts,
  };
};

export default useEmergencyContacts;
