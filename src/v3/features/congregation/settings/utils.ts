import { ChangeEvent } from 'react';

interface HandleBooleans {
  (e: ChangeEvent<HTMLInputElement>, setFunction: (value: any) => void): void;
}

const handleBoolean: HandleBooleans = (e, setFunction) => {
  setFunction(e.target.checked);
};

interface HandleNumbers {
  (e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, setFunction: (value: any) => void): void;
}

const handleNumber: HandleNumbers = (e, setFunction) => {
  setFunction(Number(e.target.value.replaceAll(/\D/g, '')));
};

export { handleBoolean, handleNumber };
