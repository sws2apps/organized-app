import { useState } from 'react';
import { useAtomValue } from 'jotai';
import { CircuitOverseerSubstituteType } from '@definition/settings';
import { settingsState } from '@states/settings';
import {
  dbCircuitOverseerVisitDelete,
  dbCircuitOverseerVisitSave,
} from '@services/dexie/circuit_overseer_visit';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { formatDate, getWeekDate } from '@utils/date';
import { VisitDetailsProps } from './index.types';

const substituteDefault: CircuitOverseerSubstituteType = {
  enabled: false,
  firstname: '',
  lastname: '',
  wife_firstname: '',
  wife_lastname: '',
};

const useVisitDetails = ({ visit, onClose, onSaved }: VisitDetailsProps) => {
  const settings = useAtomValue(settingsState);

  const [weekOf, setWeekOf] = useState(visit?.weekOf ?? '');
  const [substitute, setSubstitute] = useState(
    visit?.substitute ?? substituteDefault
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isDuplicate = settings.cong_settings.circuit_overseer.visits.some(
    (record) =>
      !record._deleted && record.id !== visit?.id && record.weekOf === weekOf
  );

  const canSave = weekOf.length > 0 && !isDuplicate && !isProcessing;

  const handleWeekChange = (value: Date | null) => {
    setWeekOf(
      value ? formatDate(getWeekDate(new Date(value)), 'yyyy/MM/dd') : ''
    );
  };

  const handleSubstituteChange = (
    changes: Partial<CircuitOverseerSubstituteType>
  ) => {
    setSubstitute((prev) => ({ ...prev, ...changes }));
  };

  const runAction = async (action: () => Promise<void>) => {
    try {
      setIsProcessing(true);
      await action();
      onClose();
    } catch (error) {
      console.error(error);
      setIsProcessing(false);

      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode((error as Error).message),
        severity: 'error',
      });
    }
  };

  const handleSave = () => {
    if (!canSave) return;

    const id = visit?.id ?? crypto.randomUUID();

    return runAction(async () => {
      await dbCircuitOverseerVisitSave({
        id,
        _deleted: false,
        updatedAt: '',
        weekOf,
        substitute: substitute.enabled ? substitute : undefined,
      });
      onSaved(id);
    });
  };

  const handleDelete = () => {
    if (!visit || isProcessing) return;

    return runAction(() => dbCircuitOverseerVisitDelete(visit));
  };

  return {
    weekOf,
    substitute,
    isDuplicate,
    canSave,
    isProcessing,
    deleteOpen,
    setDeleteOpen,
    handleWeekChange,
    handleSubstituteChange,
    handleSave,
    handleDelete,
  };
};

export default useVisitDetails;
