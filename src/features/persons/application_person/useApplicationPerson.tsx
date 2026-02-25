import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useAtom, useAtomValue } from 'jotai';
import { useQueryClient } from '@tanstack/react-query';
import { IconCheckCircle, IconError } from '@components/icons';
import { APFormType, APRecordType } from '@definition/ministry';
import { applicationsState, personsState } from '@states/persons';
import { congAccessCodeState, fullnameOptionState } from '@states/settings';
import { buildPersonFullname } from '@utils/common';
import { useAppTranslation } from '@hooks/index';
import { displaySnackNotification } from '@services/states/app';
import { CongregationUpdatesResponseType } from '@definition/api';
import {
  decryptData,
  decryptObject,
  encryptObject,
} from '@services/encryption';
import {
  apiCongregationDeleteApplication,
  apiCongregationSaveApplication,
} from '@services/api/congregation';
import { getMessageByCode } from '@services/i18n/translation';
import { formatDate, groupConsecutiveMonths } from '@utils/date';
import { dbPersonsSave } from '@services/dexie/persons';

const useApplicationPerson = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const queryClient = useQueryClient();

  const { t } = useAppTranslation();

  const [applications, setApplications] = useAtom(applicationsState);

  const persons = useAtomValue(personsState);
  const fullnameOption = useAtomValue(fullnameOptionState);
  const congAccessCode = useAtomValue(congAccessCodeState);

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

  const [formData, setFormData] = useState<APFormType>({
    continuous: application?.continuous,
    date: application && new Date(application.submitted),
    months: application?.months,
    name: name,
    coordinator: application?.coordinator,
    secretary: application?.secretary,
    service_overseer: application?.service_overseer ?? application?.['service'],
  });

  useEffect(() => {
    setFormData({
      continuous: application?.continuous,
      date: application && new Date(application.submitted),
      months: application?.months,
      name: name,
      coordinator: application?.coordinator,
      secretary: application?.secretary,
      service_overseer:
        application?.service_overseer ?? application?.['service'],
    });
  }, [application, name]);

  const handleFormChange = (value: APFormType) => setFormData(value);

  const handleDecryptApplications = (
    applications: APRecordType[],
    code: string
  ) => {
    const result = applications.map((application) => {
      const data = structuredClone(application);
      decryptObject({ data, table: 'applications', accessCode: code });

      return data;
    });

    return result;
  };

  const handleRefreshApplications = async () => {
    await queryClient.refetchQueries({ queryKey: ['congregation_updates'] });
    const updates: CongregationUpdatesResponseType = queryClient.getQueryData([
      'congregation_updates',
    ]);

    if (!updates) {
      throw new Error(t('tr_internalError'));
    }

    if (updates.status !== 200) {
      throw new Error(updates.result.message);
    }

    const remoteCode = updates.result.cong_access_code;
    const code = decryptData(remoteCode, congAccessCode, 'access_code');

    const applications = handleDecryptApplications(
      updates.result.applications,
      code
    );

    return { applications, code };
  };

  const handlePersonUpdate = async (application: APRecordType) => {
    const findPerson = persons.find(
      (record) => record.person_uid === application.person_uid
    );

    const person = structuredClone(findPerson);

    const groups = groupConsecutiveMonths(application.months);

    for (const group of groups) {
      const splits = group.split('-');
      const start = `${splits[0]}/01`;

      let [year, month] = splits[0].split('/').map(Number);

      if (splits[1]) {
        const end = splits[1].split('/').map(Number);
        year = end[0];
        month = end[1];
      }

      const end = formatDate(new Date(year, month, 0), 'yyyy/MM/dd');

      person.person_data.enrollments.push({
        id: crypto.randomUUID(),
        enrollment: 'AP',
        _deleted: false,
        start_date: start,
        end_date: end,
        updatedAt: new Date().toISOString(),
      });
    }

    await dbPersonsSave(person);

    displaySnackNotification({
      header: t('tr_newAPAdded'),
      message: t('tr_pubApprovedAsAP'),
      severity: 'success',
      icon: <IconCheckCircle color="var(--white)" />,
    });
  };

  const handleApprovalChange = async (role: string, approval: string) => {
    try {
      const latestData = await handleRefreshApplications();

      const remote = latestData.applications.find(
        (record) => record.request_id === application.request_id
      );

      if (!remote) {
        return navigate('/pioneer-applications');
      }

      const local = structuredClone(application);
      local.coordinator = remote.coordinator || 'waiting';
      local.secretary = remote.secretary || 'waiting';
      local.service_overseer = remote.service_overseer || 'waiting';
      local.updatedAt = remote.updatedAt;

      local[role] = approval;

      let updates: APRecordType[];

      const waiting =
        local.coordinator === 'waiting' ||
        local.secretary === 'waiting' ||
        local.service_overseer === 'waiting';

      const rejected =
        !waiting &&
        (local.coordinator === 'rejected' ||
          local.secretary === 'rejected' ||
          local.service_overseer === 'rejected');

      // delete application
      if (rejected) {
        updates = await apiCongregationDeleteApplication(local.request_id);
      }

      if (!rejected) {
        if (
          local.coordinator === 'approved' &&
          local.secretary === 'approved' &&
          local.service_overseer === 'approved'
        ) {
          local.status = 'approved';
          local.notified = true;
        }

        local.updatedAt = new Date().toISOString();

        encryptObject({
          data: local,
          table: 'applications',
          accessCode: latestData.code,
        });

        updates = await apiCongregationSaveApplication(local);
      }

      const newApplications = handleDecryptApplications(
        updates,
        latestData.code
      );

      setApplications(newApplications);

      if (rejected) {
        displaySnackNotification({
          header: t('tr_applicationRejected'),
          message: t('tr_applicationRejectedDesc'),
          severity: 'success',
          icon: <IconCheckCircle color="var(--white)" />,
        });

        navigate('/pioneer-applications');
      }

      const newApplication = newApplications.find(
        (record) => record.request_id === application.request_id
      );

      if (newApplication?.status === 'approved') {
        await handlePersonUpdate(newApplication);
      }
    } catch (error) {
      console.error(error);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
        icon: <IconError color="var(--white)" />,
      });
    }
  };

  const handleCoordinatorApproved = async () => {
    await handleApprovalChange('coordinator', 'approved');
  };

  const handleCoordinatorRejected = async () => {
    await handleApprovalChange('coordinator', 'rejected');
  };

  const handleSecretaryApproved = async () => {
    await handleApprovalChange('secretary', 'approved');
  };

  const handleSecretaryRejected = async () => {
    await handleApprovalChange('secretary', 'rejected');
  };

  const handleServiceApproved = async () => {
    await handleApprovalChange('service_overseer', 'approved');
  };

  const handleServiceRejected = async () => {
    await handleApprovalChange('service_overseer', 'rejected');
  };

  return {
    formData,
    handleFormChange,
    handleCoordinatorApproved,
    handleCoordinatorRejected,
    handleSecretaryApproved,
    handleSecretaryRejected,
    handleServiceApproved,
    handleServiceRejected,
  };
};

export default useApplicationPerson;
