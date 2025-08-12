import { useMemo, useState } from 'react';
import { useAtomValue } from 'jotai';
import { AddTimeDialogProps } from './index.types';
import { userMinistryTimerState } from '@states/user_field_service_reports';

const useAddTimeDialog = ({ time, onAdd, onClose }: AddTimeDialogProps) => {
  const timer = useAtomValue(userMinistryTimerState);

  const initialValue = useMemo(() => {
    if (!timer) return time;

    return timer.value;
  }, [timer, time]);

  const [value, setValue] = useState(initialValue);

  const handleValueChange = (value: number) => {
    setValue(value);
  };

  const handleAddTime = () => {
    onAdd?.(value);
    onClose();
  };

  return { handleValueChange, handleAddTime, value };
};

export default useAddTimeDialog;
