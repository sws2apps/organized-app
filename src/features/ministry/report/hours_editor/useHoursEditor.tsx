import { useEffect, useState } from 'react';
import { HoursEditorProps } from './index.types';

const useHoursEditor = ({ value, onChange }: HoursEditorProps) => {
  const [inputValue, setInputValue] = useState(value);

  const handleValueChange = (value: string) => {
    setInputValue(value);
    onChange?.(value);
  };

  const handleIncrement = () => {
    if (inputValue.length === 0) {
      setInputValue('1:00');
      onChange?.('1:00');
      return;
    }

    const [hours, minutes] = inputValue.split(':');

    const newHours = +hours + 1;
    const newMinutes = +minutes;

    const value = `${newHours}:${String(newMinutes).padStart(2, '0')}`;

    setInputValue(value);
    onChange?.(value);
  };

  const handleDecrement = () => {
    if (inputValue.length === 0) {
      setInputValue('0:00');
      onChange?.('0:00');
      return;
    }

    const [hours, minutes] = inputValue.split(':');

    let newHours = +hours - 1;
    let newMinutes = +minutes;

    if (newHours === -1) {
      newMinutes = 0;
      newHours = 0;
    }

    const value = `${newHours}:${String(newMinutes).padStart(2, '0')}`;

    setInputValue(value);
    onChange?.(value);
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return { inputValue, handleIncrement, handleDecrement, handleValueChange };
};

export default useHoursEditor;
