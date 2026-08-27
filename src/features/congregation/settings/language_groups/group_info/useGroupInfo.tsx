import { useEffect, useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { displaySnackNotification } from '@services/states/app';
import { refreshLocaleDerivedData } from '@services/app/locale_derived_data';
import { syncJWMeetingMaterials } from '@services/app/meeting_materials';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { settingsState, userDataViewState } from '@states/settings';
import { GroupInfoProps } from './index.types';
import { FieldServiceGroupType } from '@definition/field_service_groups';
import { dbFieldServiceGroupSave } from '@services/dexie/field_service_groups';

const useGroupInfo = ({ group, onClose }: GroupInfoProps) => {
  const { t } = useAppTranslation();

  const settings = useAtomValue(settingsState);
  const dataView = useAtomValue(userDataViewState);

  const circuitNumber = useMemo(() => {
    return (
      settings.cong_settings.cong_circuit.find(
        (record) => record.type === group.group_id
      )?.value ?? ''
    );
  }, [settings, group.group_id]);

  const jwLang = useMemo(() => {
    const sourceLanguages = settings.cong_settings.source_material.language;

    return (
      sourceLanguages.find((record) => record.type === group.group_id)?.value ??
      'E'
    );
  }, [settings, group.group_id]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [circuit, setCircuit] = useState(circuitNumber);
  const [language, setLanguage] = useState(jwLang.toUpperCase());
  const [groupEdit, setGroupEdit] = useState(group);

  const handleClose = () => onClose?.();

  const handleGroupChange = (group: FieldServiceGroupType) => {
    setGroupEdit(group);
  };

  const handleNameChange = (value: string) => {
    setGroupEdit((prev) => {
      const group = structuredClone(prev);
      group.group_data.name = value;
      return group;
    });
  };

  const handleCircuitChange = (value: string) => setCircuit(value);

  const handleLanguageChange = (value: string) => setLanguage(value);

  const handleSaveChange = async () => {
    if (
      groupEdit.group_data.name.length === 0 ||
      circuit.length === 0 ||
      language.length === 0
    ) {
      return;
    }

    if (isProcessing) return;

    try {
      setIsProcessing(true);

      groupEdit.group_data.updatedAt = new Date().toISOString();

      const sourceLanguages = structuredClone(
        settings.cong_settings.source_material.language
      );

      const findLanguage = sourceLanguages.find(
        (record) => record.type === group.group_id
      );

      const normalizedLanguage = language.toUpperCase();
      const activeGroupLanguageChanged =
        dataView === group.group_id &&
        findLanguage?.value !== normalizedLanguage;

      if (findLanguage) {
        findLanguage.value = normalizedLanguage;
        findLanguage.updatedAt = new Date().toISOString();
      }

      const circuits = structuredClone(settings.cong_settings.cong_circuit);

      const findCircuit = circuits.find(
        (record) => record.type === group.group_id
      );

      if (findCircuit) {
        findCircuit.value = circuit;
        findCircuit.updatedAt = new Date().toISOString();
      }

      await dbAppSettingsUpdate({
        'cong_settings.source_material.language': sourceLanguages,
        'cong_settings.cong_circuit': circuits,
      });

      await dbFieldServiceGroupSave(groupEdit);

      if (activeGroupLanguageChanged) {
        await refreshLocaleDerivedData();

        try {
          await syncJWMeetingMaterials(normalizedLanguage);
        } catch (error) {
          console.error(error);
        }
      }

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

  useEffect(() => {
    setCircuit(circuitNumber);
    setLanguage(jwLang.toUpperCase());
  }, [circuitNumber, jwLang]);

  return {
    handleClose,
    isProcessing,
    groupEdit,
    handleNameChange,
    handleCircuitChange,
    handleSaveChange,
    handleLanguageChange,
    circuit,
    handleGroupChange,
    language,
  };
};

export default useGroupInfo;
