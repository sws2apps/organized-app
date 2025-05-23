import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { displaySnackNotification } from '@services/states/app';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { dbPersonsBulkSave } from '@services/dexie/persons';
import { personsActiveState } from '@states/persons';
import { settingsState } from '@states/settings';
import { GroupInfoProps } from './index.types';

const useGroupInfo = ({ group, onClose }: GroupInfoProps) => {
  const { t } = useAppTranslation();

  const personsActive = useAtomValue(personsActiveState);
  const settings = useAtomValue(settingsState);

  const circuitNumber = useMemo(() => {
    return (
      settings.cong_settings.cong_circuit.find(
        (record) => record.type === group.id
      )?.value || ''
    );
  }, [settings, group.id]);

  const group_members = useMemo(() => {
    return personsActive
      .filter((record) => {
        if (Array.isArray(record.person_data.categories)) {
          return false;
        }

        if (group.overseers.some((ad) => ad === record.person_uid))
          return false;

        return record.person_data.categories.value.includes(group.id);
      })
      .map((record) => record.person_uid);
  }, [personsActive, group]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [members, setMembers] = useState(group_members);
  const [circuit, setCircuit] = useState(circuitNumber);

  const [groupEdit, setGroupEdit] = useState(group);

  const handleClose = () => {
    onClose?.();
  };

  const handleNameChange = (value: string) => {
    setGroupEdit((prev) => {
      const data = structuredClone(prev);
      data.name = value;

      return data;
    });
  };

  const handleCircuitChange = (value: string) => setCircuit(value);

  const handleLanguageChange = (value: string) => {
    setGroupEdit((prev) => {
      const data = structuredClone(prev);
      data.language = value;

      return data;
    });
  };

  const handleOverseersChange = (values: string[]) => {
    setGroupEdit((prev) => {
      const data = structuredClone(prev);
      data.overseers = values;

      return data;
    });
  };

  const handleOverseerDelete = (value: string) => {
    setGroupEdit((prev) => {
      const data = structuredClone(prev);
      data.overseers = data.overseers.filter((record) => record !== value);

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
      circuit.length === 0 ||
      groupEdit.language.length === 0
    ) {
      return;
    }

    if (isProcessing) return;

    try {
      setIsProcessing(true);

      const groups = structuredClone(
        settings.cong_settings.language_groups.groups
      );
      const findGroup = groups.find((record) => record.id === group.id);

      findGroup.overseers = groupEdit.overseers;
      findGroup.language = groupEdit.language;
      findGroup.name = groupEdit.name;
      findGroup.updatedAt = new Date().toISOString();

      const sourceLanguages = structuredClone(
        settings.cong_settings.source_material.language
      );

      const findLanguage = sourceLanguages.find(
        (record) => record.type === group.id
      );

      if (findLanguage) {
        findLanguage.value = groupEdit.language.toUpperCase();
        findLanguage.updatedAt = new Date().toISOString();
      }

      const circuits = structuredClone(settings.cong_settings.cong_circuit);

      const findCircuit = circuits.find((record) => record.type === group.id);

      if (findCircuit) {
        findCircuit.value = circuit;
        findCircuit.updatedAt = new Date().toISOString();
      }

      await dbAppSettingsUpdate({
        'cong_settings.language_groups.groups': groups,
        'cong_settings.source_material.language': sourceLanguages,
        'cong_settings.cong_circuit': circuits,
      });

      const membersAll = members.concat(groupEdit.overseers);
      const oldMembers = group_members.concat(group.overseers);

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
            const categories = Array.from(
              new Set([...person.person_data.categories.value, group.id])
            );

            person.person_data.categories.value = categories;
            person.person_data.categories.updatedAt = new Date().toISOString();
          }

          return person;
        });

      const personsToUpdate = deletedMembers.concat(addedMembers);
      await dbPersonsBulkSave(personsToUpdate);

      setIsProcessing(false);

      handleClose();
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
    handleClose,
    isProcessing,
    groupEdit,
    handleNameChange,
    handleCircuitChange,
    handleSaveChange,
    handleLanguageChange,
    handleOverseersChange,
    handleOverseerDelete,
    handleMembersChange,
    handleMemberDelete,
    members,
    circuit,
  };
};

export default useGroupInfo;
