import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { Navigate, useParams } from 'react-router';
import { applicationsState, personsState } from '@states/persons';
import { fullnameOptionState } from '@states/settings';
import { buildPersonFullname } from '@utils/common';

const useApplicationDetails = () => {
  const { id } = useParams();

  const applications = useAtomValue(applicationsState);
  const persons = useAtomValue(personsState);
  const fullnameOption = useAtomValue(fullnameOptionState);

  const application = useMemo(() => {
    return applications.find((record) => record.request_id === id);
  }, [id, applications]);

  const name = useMemo(() => {
    if (!application) return '';

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

  if (!application) return <Navigate to="/pioneer-applications" />;

  return { name };
};

export default useApplicationDetails;
