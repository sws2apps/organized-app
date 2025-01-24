import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { PersonType } from '@definition/person';
import { userMembersDelegateState } from '@states/settings';
import { personsActiveState } from '@states/persons';
import { reportUserSelectedMonthState } from '@states/user_field_service_reports';
import usePerson from '@features/persons/hooks/usePerson';

const useDelegateReports = () => {
  const { personIsPublisher } = usePerson();

  const persons = useRecoilValue(personsActiveState);
  const delegatedPersons = useRecoilValue(userMembersDelegateState);
  const month = useRecoilValue(reportUserSelectedMonthState);

  const [open, setOpen] = useState(false);

  const publishers = useMemo(() => {
    const result: PersonType[] = [];

    for (const person of delegatedPersons) {
      const findPerson = persons.find((record) => record.person_uid === person);

      if (!findPerson) continue;

      const isPublisher = personIsPublisher(findPerson, month);

      if (isPublisher) {
        result.push(findPerson);
      }
    }

    return result.sort((a, b) =>
      a.person_data.person_firstname.value.localeCompare(
        b.person_data.person_firstname.value
      )
    );
  }, [delegatedPersons, persons, month, personIsPublisher]);

  const handleToggleCollapse = () => setOpen((prev) => !prev);

  return { publishers, handleToggleCollapse, open };
};

export default useDelegateReports;
