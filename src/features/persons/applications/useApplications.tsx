import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { APRecordType } from '@definition/ministry';
import {
  applicationsApprovedState,
  applicationsNewState,
  personsState,
} from '@states/persons';
import ListItems from './list_items';

const useApplications = () => {
  const { t } = useAppTranslation();

  const applications_new = useRecoilValue(applicationsNewState);
  const applications_approved = useRecoilValue(applicationsApprovedState);
  const persons = useRecoilValue(personsState);

  const [search, setSearch] = useState('');
  const [currentTab, setCurrentTab] = useState(0);

  const applications = useMemo(() => {
    const result: APRecordType[] = [];

    if (currentTab === 0) {
      const data = applications_new.filter((application) => {
        const person = persons.find(
          (record) => record.person_uid === application.person_uid
        );
        const firstname = person.person_data.person_firstname.value;
        const lastname = person.person_data.person_lastname.value;

        return firstname.includes(search) || lastname.includes(search);
      });

      result.push(...data);
    }

    if (currentTab === 1) {
      const data = applications_approved.filter((application) => {
        const person = persons.find(
          (record) => record.person_uid === application.person_uid
        );
        const firstname = person.person_data.person_firstname.value;
        const lastname = person.person_data.person_lastname.value;

        return firstname.includes(search) || lastname.includes(search);
      });

      result.push(...data);
    }

    return result;
  }, [search, persons, applications_new, applications_approved, currentTab]);

  const AP_count = useMemo(() => {
    return applications.length.toString();
  }, [applications]);

  const tabs = useMemo(() => {
    return [
      {
        label: t('tr_newApplications'),
        Component: <ListItems applications={applications} />,
      },
      {
        label: t('tr_approved'),
        Component: <ListItems applications={applications} />,
      },
    ];
  }, [t, applications]);

  const handleSearchChange = (value: string) => setSearch(value);

  const handleTabChange = (value: number) => setCurrentTab(value);

  return {
    AP_count,
    search,
    handleSearchChange,
    tabs,
    currentTab,
    handleTabChange,
  };
};

export default useApplications;
