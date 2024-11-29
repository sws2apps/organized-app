import { useMemo, useState } from 'react';
import { GroupEditProps } from './index.types';
import { FieldServiceGroupType } from '@definition/field_service_groups';
import { dbFieldServiceGroupSave } from '@services/dexie/field_service_groups';
import { displaySnackNotification } from '@services/recoil/app';
import { getMessageByCode } from '@services/i18n/translation';

const useGroupEdit = ({ group, onClose }: GroupEditProps) => {
  const [tmpGroup, setTmpGroup] = useState(group);

  const name = useMemo(() => {
    if (!tmpGroup) return '';

    return tmpGroup.group_data.name;
  }, [tmpGroup]);

  const handleNameChange = (value: string) => {
    const newGroup = structuredClone(tmpGroup);
    newGroup.group_data.name = value;
    newGroup.group_data.updatedAt = new Date().toISOString();

    setTmpGroup(newGroup);
  };

  const handleGroupUpdate = (value: FieldServiceGroupType) => {
    setTmpGroup(value);
  };

  const handleSaveChanges = async () => {
    try {
      await dbFieldServiceGroupSave(tmpGroup);

      onClose?.();
    } catch (error) {
      console.error(error);

      await displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    }
  };

  return {
    name,
    handleNameChange,
    handleGroupUpdate,
    tmpGroup,
    handleSaveChanges,
  };
};

export default useGroupEdit;
