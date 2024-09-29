import { useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import { useParams } from 'react-router-dom';
import { applicationsState, personsState } from '@states/persons';
import { fullnameOptionState } from '@states/settings';
import { buildPersonFullname } from '@utils/common';

const useApplicationDetails = () => {
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

  return { name };
};

export default useApplicationDetails;
