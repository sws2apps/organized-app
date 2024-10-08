import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { currentAPFormState } from '@states/ministry';
import { APFormType, APRecordType } from '@definition/ministry';
import { buildPersonFullname } from '@utils/common';
import { congAccessCodeState, fullnameOptionState } from '@states/settings';
import { apiUserGetApplications, apiValidateMe } from '@services/api/user';
import { decryptData, decryptObject } from '@services/encryption';
import useCurrentUser from '@hooks/useCurrentUser';

const useMainForm = () => {
  const { data } = useQuery({
    queryKey: ['user_applications'],
    queryFn: apiUserGetApplications,
    refetchOnMount: 'always',
  });

  const { data: whoami } = useQuery({
    queryKey: ['application_whoami'],
    queryFn: apiValidateMe,
  });

  const { person } = useCurrentUser();

  const resetForm = useResetRecoilState(currentAPFormState);

  const [formData, setFormData] = useRecoilState(currentAPFormState);

  const fullnameOption = useRecoilValue(fullnameOptionState);
  const congAccessCode = useRecoilValue(congAccessCodeState);

  const [applications, setApplications] = useState<APRecordType[]>([]);

  const handleFormChange = (value: APFormType) => setFormData(value);

  useEffect(() => {
    resetForm();

    if (person) {
      const fullname = buildPersonFullname(
        person.person_data.person_lastname.value,
        person.person_data.person_firstname.value,
        fullnameOption
      );

      setFormData((prev) => {
        const form = structuredClone(prev);
        form.name = fullname;

        return form;
      });
    }
  }, [person, fullnameOption, setFormData, resetForm]);

  useEffect(() => {
    const loadApplications = () => {
      if (Array.isArray(data) && data.length > 0) {
        const incoming = structuredClone(data);

        let accessCode: string;
        const remoteCode = whoami?.result?.cong_access_code;

        if (remoteCode) {
          accessCode = decryptData(remoteCode, congAccessCode);
        }

        if (!accessCode) return;

        const applications = incoming.map((record) => {
          decryptObject({ data: record, table: 'applications', accessCode });
          return record;
        });

        setApplications(applications);
      }
    };

    loadApplications();
  }, [data, whoami, congAccessCode]);

  return { formData, handleFormChange, applications };
};

export default useMainForm;
