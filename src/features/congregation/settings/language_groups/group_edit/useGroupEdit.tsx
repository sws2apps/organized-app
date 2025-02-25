import { useMemo, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useAppTranslation } from '@hooks/index';
import { displaySnackNotification } from '@services/recoil/app';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { dbPersonsBulkSave } from '@services/dexie/persons';
import { personsActiveState } from '@states/persons';
import { languageGroupsState } from '@states/settings';
import { GroupEditProps } from './index.types';

const useGroupEdit = ({ group }: GroupEditProps) => {
  const { t } = useAppTranslation();

  const personsActive = useRecoilValue(personsActiveState);
  const languageGroups = useRecoilValue(languageGroupsState);

  const group_members = useMemo(() => {
    return personsActive
      .filter((record) => {
        if (Array.isArray(record.person_data.categories)) {
          return false;
        }

        if (group.admins.some((ad) => ad === record.person_uid)) return false;

        return record.person_data.categories.value.includes(group.id);
      })
      .map((record) => record.person_uid);
  }, [personsActive, group]);

  const [open, setOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [members, setMembers] = useState(group_members);

  const [groupEdit, setGroupEdit] = useState(group);

  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    setGroupEdit(group);
    setMembers(group_members);
  };

  const handleNameChange = (value: string) => {
    setGroupEdit((prev) => {
      const data = structuredClone(prev);
      data.name = value;

      return data;
    });
  };

  const handleCircuitChange = (value: string) => {
    setGroupEdit((prev) => {
      const data = structuredClone(prev);
      data.circuit = value;

      return data;
    });
  };

  const handleLanguageChange = (value: string) => {
    setGroupEdit((prev) => {
      const data = structuredClone(prev);
      data.language = value;

      return data;
    });
  };

  const handleAdminsChange = (values: string[]) => {
    setGroupEdit((prev) => {
      const data = structuredClone(prev);
      data.admins = values;

      return data;
    });
  };

  const handleAdminDelete = (value: string) => {
    setGroupEdit((prev) => {
      const data = structuredClone(prev);
      data.admins = data.admins.filter((record) => record !== value);

      return data;
    });
  };

  const handleMembersChange = (values: string[]) => {
    setMembers(values);
  };

  const handleMemberDelete = (value: string) => {
    setMembers((prev) => {
      const data = prev.filter((record) => record !== value);
      return data;
    });
  };

  const handleSaveChange = async () => {
    if (
      groupEdit.name.length === 0 ||
      groupEdit.circuit.length === 0 ||
      groupEdit.language.length === 0
    ) {
      return;
    }

    if (isProcessing) return;

    try {
      setIsProcessing(true);

      const groups = structuredClone(languageGroups);
      const findGroup = groups.find((record) => record.id === group.id);

      findGroup.admins = groupEdit.admins;
      findGroup.circuit = groupEdit.circuit;
      findGroup.language = groupEdit.language;
      findGroup.name = groupEdit.name;
      findGroup.updatedAt = new Date().toISOString();

      await dbAppSettingsUpdate({
        'cong_settings.language_groups.groups': groups,
      });

      const membersAll = members.concat(groupEdit.admins);
      const oldMembers = group_members.concat(group.admins);

      const deletedMembers = oldMembers
        .filter((record) => membersAll.some((m) => m === record) === false)
        .map((record) => {
          const find = personsActive.find((p) => p.person_uid === record);

          const person = structuredClone(find);

          person.person_data.categories.updatedAt = new Date().toISOString();
          person.person_data.categories.value =
            person.person_data.categories.value.filter((c) => c !== group.id);

          return person;
        });

      const addedMembers = membersAll
        .filter((record) => oldMembers.some((m) => m === record) === false)
        .map((record) => {
          const find = personsActive.find((p) => p.person_uid === record);

          const person = structuredClone(find);

          if (Array.isArray(person.person_data.categories)) {
            person.person_data.categories = {
              value: ['main', group.id],
              updatedAt: new Date().toISOString(),
            };
          } else {
            person.person_data.categories.value.push(group.id);
            person.person_data.categories.updatedAt = new Date().toISOString();
          }

          return person;
        });

      const personsToUpdate = deletedMembers.concat(addedMembers);
      await dbPersonsBulkSave(personsToUpdate);

      setIsProcessing(false);

      setOpen(false);
    } catch (error) {
      setIsProcessing(false);

      console.error(error);

      displaySnackNotification({
        severity: 'error',
        header: t('error_app_generic-title'),
        message: (error as Error).message,
      });
    }
  };

  return {
    open,
    handleOpen,
    handleClose,
    isProcessing,
    groupEdit,
    handleNameChange,
    handleCircuitChange,
    handleSaveChange,
    handleLanguageChange,
    handleAdminsChange,
    handleAdminDelete,
    handleMembersChange,
    handleMemberDelete,
    members,
  };
};

export default useGroupEdit;
