import { ChangeEvent } from 'react';

interface HandleBooleans {
  (e: ChangeEvent<HTMLInputElement>, setFunction: (value: boolean) => void): void;
}

const handleBoolean: HandleBooleans = (e, setFunction) => {
  setFunction(e.target.checked);
};

interface HandleNumbers {
  (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, setFunction: (value: number) => void): void;
}

const handleNumber: HandleNumbers = (e, setFunction) => {
  setFunction(Number(e.target.value.replaceAll(/\D/g, '')));
};

export { handleBoolean, handleNumber };
