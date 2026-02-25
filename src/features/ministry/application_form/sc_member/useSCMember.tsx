import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useAtomValue } from 'jotai';
import { AppRoleType } from '@definition/app';
import { CommitteeMemberProps } from './index.types';
import { useAppTranslation } from '@hooks/index';
import { congRoleState } from '@states/settings';

const useSCMember = ({ type, application }: CommitteeMemberProps) => {
  const { id } = useParams();

  const { t } = useAppTranslation();

  const isEdit = id !== undefined;

  const congRole = useAtomValue(congRoleState);

  const [override, setOverride] = useState(false);

  const label = useMemo(() => {
    if (type === 'coordinator') {
      return t('tr_coordinator');
    }

    if (type === 'secretary') {
      return t('tr_secretary');
    }

    if (type === 'service_overseer') {
      return t('tr_serviceOverseer');
    }
  }, [type, t]);

  const allowEdit = useMemo(() => {
    // give admin full access
    if (congRole.includes('admin')) return true;

    return congRole.includes(type as AppRoleType);
  }, [congRole, type]);

  const status = useMemo(() => {
    if (!application[type]) return 'waiting';

    return application[type];
  }, [application, type]);

  const allowOverride = useMemo(() => {
    const approved =
      application.coordinator === 'approved' &&
      application.secretary === 'approved' &&
      application.service === 'approved';

    return !approved;
  }, [application]);

  const handleOverride = () => setOverride(true);

  useEffect(() => {
    setOverride(false);
  }, [application]);

  return {
    isEdit,
    label,
    allowEdit,
    status,
    allowOverride,
    handleOverride,
    override,
  };
};

export default useSCMember;
