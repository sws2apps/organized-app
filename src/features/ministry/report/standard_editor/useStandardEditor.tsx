import { ChangeEvent, useEffect, useState } from 'react';
import { TextFieldStandardProps } from './index.types';

const useStandardEditor = ({
  value,
  onChange,
  validator,
}: TextFieldStandardProps) => {
  const [inputValue, setInputValue] = useState(value || 0);

  const handleValueChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = +e.target.value;

    if (value < 0) {
      e.preventDefault();
      return;
    }

    if (validator) {
      const valid = await validator(value);

      if (!valid) return;
    }

    setInputValue(+value);
    onChange?.(value);
  };

  const handleIncrement = async () => {
    const value = inputValue + 1;

    if (validator) {
      const valid = await validator(value);

      if (!valid) return;
    }

    setInputValue(value);
    onChange?.(value);
  };

  const handleDecrement = async () => {
    const value = inputValue - 1;

    if (value < 0) {
      return;
    }

    if (validator) {
      const valid = await validator(value);

      if (!valid) return;
    }

    setInputValue(value);
    onChange?.(value);
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return { inputValue, handleIncrement, handleDecrement, handleValueChange };
};

export default useStandardEditor;
