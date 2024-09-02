import { useState } from 'react';
import { AddTimeDialogProps } from './index.types';

const useAddTimeDialog = ({ onAdd, onClose }: AddTimeDialogProps) => {
  const [value, setValue] = useState(0);

  const handleValueChange = (value: number) => setValue(value);

  const handleAddTime = () => {
    onAdd?.(value);
    onClose();
  };

  return { handleValueChange, handleAddTime };
};

export default useAddTimeDialog;
