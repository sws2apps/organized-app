import { useState } from 'react';

const useBibleStudiesEditor = () => {
  const [value, setValue] = useState(0);

  const handleValueChange = (value: string) => {
    setValue(+value);
  };

  const handleIncrement = () => {
    setValue((prev) => prev + 1);
  };

  const handleDecrement = () => {
    setValue((prev) => {
      const newValue = prev === 0 ? 0 : prev - 1;
      return newValue;
    });
  };

  return { value, handleIncrement, handleDecrement, handleValueChange };
};

export default useBibleStudiesEditor;
