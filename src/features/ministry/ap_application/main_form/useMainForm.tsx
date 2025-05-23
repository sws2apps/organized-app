import { useEffect, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { useQuery } from '@tanstack/react-query';
import { currentAPFormState } from '@states/ministry';
import { APFormType, APRecordType } from '@definition/ministry';
import { buildPersonFullname } from '@utils/common';
import {
  accountTypeState,
  congAccessCodeState,
  fullnameOptionState,
} from '@states/settings';
import { apiUserGetApplications, apiValidateMe } from '@services/api/user';
import { decryptData, decryptObject } from '@services/encryption';
import {
  apiGetPocketApplications,
  apiPocketValidateMe,
} from '@services/api/pocket';
import useCurrentUser from '@hooks/useCurrentUser';

const useMainForm = () => {
  const accountType = useAtomValue(accountTypeState);

  const { data: applicationsVIP } = useQuery({
    enabled: accountType === 'vip',
    queryKey: ['user_applications'],
    queryFn: apiUserGetApplications,
    refetchOnMount: 'always',
  });

  const { data: applicationsPocket } = useQuery({
    enabled: accountType === 'pocket',
    queryKey: ['user_applications'],
    queryFn: apiGetPocketApplications,
    refetchOnMount: 'always',
  });

  const { data: whoamiVIP } = useQuery({
    enabled: accountType === 'vip',
    queryKey: ['application_whoami'],
    queryFn: apiValidateMe,
  });

  const { data: whoamiPocket } = useQuery({
    enabled: accountType === 'pocket',
    queryKey: ['application_whoami'],
    queryFn: apiPocketValidateMe,
  });

  const { person } = useCurrentUser();

  const resetForm = useResetAtom(currentAPFormState);

  const [formData, setFormData] = useAtom(currentAPFormState);

  const fullnameOption = useAtomValue(fullnameOptionState);
  const congAccessCode = useAtomValue(congAccessCodeState);

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
      let applications: APRecordType[];

      if (accountType === 'vip') {
        applications = applicationsVIP;
      }

      if (accountType === 'pocket') {
        applications = applicationsPocket;
      }

      if (Array.isArray(applications) && applications.length > 0) {
        const incoming = structuredClone(applications);

        let accessCode: string;

        if (accountType === 'vip') {
          const remoteCode = whoamiVIP?.result?.cong_access_code;

          if (remoteCode) {
            accessCode = decryptData(remoteCode, congAccessCode, 'access_code');
          }
        }

        if (accountType === 'pocket') {
          const remoteCode =
            whoamiPocket?.result.app_settings.cong_settings.cong_access_code;

          if (remoteCode) {
            accessCode = decryptData(remoteCode, congAccessCode, 'access_code');
          }
        }

        if (!accessCode) return;

        const applicationsDecrypted = incoming.map((record) => {
          decryptObject({ data: record, table: 'applications', accessCode });
          return record;
        });

        setApplications(applicationsDecrypted);
      }
    };

    loadApplications();
  }, [
    applicationsVIP,
    applicationsPocket,
    accountType,
    whoamiVIP,
    whoamiPocket,
    congAccessCode,
  ]);

  return { formData, handleFormChange, applications };
};

export default useMainForm;
