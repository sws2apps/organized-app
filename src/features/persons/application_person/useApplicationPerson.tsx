import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { APFormType } from '@definition/ministry';
import { applicationsState, personsState } from '@states/persons';
import { fullnameOptionState } from '@states/settings';
import { buildPersonFullname } from '@utils/common';

const useApplicationPerson = () => {
  const { id } = useParams();

  const applications = useRecoilValue(applicationsState);
  const persons = useRecoilValue(personsState);
  const fullnameOption = useRecoilValue(fullnameOptionState);

  const application = useMemo(() => {
    return applications.find((record) => record.request_id === id);
  }, [id, applications]);

  const name = useMemo(() => {
    const person = persons.find(
      (record) => record.person_uid === application.person_uid
    );

    if (!person) return '';

    return buildPersonFullname(
      person.person_data.person_lastname.value,
      person.person_data.person_firstname.value,
      fullnameOption
    );
  }, [application, persons, fullnameOption]);

  const [formData, setFormData] = useState<APFormType>({
    continuous: application.continuous,
    date: new Date(application.submitted),
    months: application.months,
    name: name,
  });

  const handleFormChange = (value: APFormType) => setFormData(value);

  return { formData, handleFormChange };
};

export default useApplicationPerson;
