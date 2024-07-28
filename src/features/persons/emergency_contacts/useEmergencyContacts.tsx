import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { personCurrentDetailsState } from '@states/persons';
import { setPersonCurrentDetails } from '@services/recoil/persons';

const useEmergencyContacts = () => {
  const { id } = useParams();
  const isAddPerson = id === undefined;

  const person = useRecoilValue(personCurrentDetailsState);

  const activeContacts = person.person_data.emergency_contacts.filter(
    (record) => record._deleted.value === false
  );

  const handleAddContact = async () => {
    const newPerson = structuredClone(person);

    newPerson.person_data.emergency_contacts.push({
      id: crypto.randomUUID(),
      name: { value: '', updatedAt: '' },
      contact: { value: '', updatedAt: '' },
      _deleted: { value: false, updatedAt: '' },
    });

    await setPersonCurrentDetails(newPerson);
  };

  const handleDeleteContact = async (id: string) => {
    const newPerson = structuredClone(person);

    if (!isAddPerson) {
      const current = newPerson.person_data.emergency_contacts.find(
        (contact) => contact.id === id
      );
      current._deleted = { value: true, updatedAt: new Date().toISOString() };
    }

    if (isAddPerson) {
      newPerson.person_data.emergency_contacts =
        newPerson.person_data.emergency_contacts.filter(
          (contact) => contact.id !== id
        );
    }

    await setPersonCurrentDetails(newPerson);
  };

  const handleNameChange = async (id: string, value: string) => {
    const newPerson = structuredClone(person);

    const current = newPerson.person_data.emergency_contacts.find(
      (contact) => contact.id === id
    );
    current.name = { value, updatedAt: new Date().toISOString() };

    await setPersonCurrentDetails(newPerson);
  };

  const handleContactChange = async (id: string, value: string) => {
    const newPerson = structuredClone(person);

    const current = newPerson.person_data.emergency_contacts.find(
      (history) => history.id === id
    );
    current.contact = { value, updatedAt: new Date().toISOString() };

    await setPersonCurrentDetails(newPerson);
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
