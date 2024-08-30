import { ChangeEvent, useEffect, useState } from 'react';
import { BibleStudiesEditorProps } from './index.types';

const useBibleStudiesEditor = ({
  value,
  onChange,
  validator,
}: BibleStudiesEditorProps) => {
  const [inputValue, setInputValue] = useState(value || 0);

  const handleValueChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = +e.target.value;

    if (value < 0) {
      e.preventDefault();
      return;
    }

    const valid = await validator(value);

    if (!valid) return;

    setInputValue(+value);
    onChange?.(value);
  };

  const handleIncrement = () => {
    const value = inputValue + 1;

    setInputValue(value);
    onChange?.(value);
  };

  const handleDecrement = async () => {
    const value = inputValue - 1;

    if (value < 0) {
      return;
    }

    const valid = await validator(value);

    if (!valid) return;

    setInputValue(value);
    onChange?.(value);
  };

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return { inputValue, handleIncrement, handleDecrement, handleValueChange };
};

export default useBibleStudiesEditor;
