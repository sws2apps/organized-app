import { KeyboardEvent, WheelEvent, useEffect, useRef } from 'react';
import { TimeFieldProps } from './index.types';

const useTimeField = ({ value, onChange, hoursLength = 3 }: TimeFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBlur = () => {
    const inputElement = inputRef.current;

    if (inputElement.value === '0:00') {
      inputElement.value = '';
    }
  };

  const handleClick = () => {
    const inputElement = inputRef.current;

    // If blank set default value and select hours part
    if (inputElement.value === '') {
      inputElement.value = '0:00';
      const colonPosition = inputElement.value.indexOf(':');
      return inputElement.setSelectionRange(0, colonPosition);
    }

    const selectionStart = inputElement.selectionStart || 0;
    const selectionEnd = inputElement.selectionEnd || 0;
    const colonPosition = inputElement.value.indexOf(':');

    // only start auto-select when nothing is selected or if colon selected
    if (selectionStart === colonPosition || selectionStart === selectionEnd) {
      if (selectionStart >= colonPosition + 1) {
        // Select minutes part
        inputElement.setSelectionRange(
          colonPosition + 1,
          inputElement.value.length
        );
      } else {
        // Select hours part, excluding the colon
        inputElement.setSelectionRange(0, colonPosition);
      }
    }
  };

  const handleDigitsTyped = (key: string) => {
    const inputElement = inputRef.current;

    const selectionStart = inputElement.selectionStart || 0;
    const colonPosition = inputElement.value.indexOf(':');

    const [hours, minutes] = inputElement.value.split(':');

    // update hours
    if (selectionStart < colonPosition) {
      if (hours.length < hoursLength) {
        const currentHours = +hours;

        if (currentHours === 0) {
          inputElement.value = `${key}:${minutes}`;
        }

        if (currentHours > 0) {
          inputElement.value = `${hours}${key}:${minutes}`;
        }
      }

      if (hours.length === hoursLength) {
        inputElement.value = `${key}:${minutes}`;
      }
    }

    // update minutes
    if (selectionStart > colonPosition) {
      const newMinutes = String(`${minutes}${key}`).slice(-2);

      if (+newMinutes < 60) {
        inputElement.value = `${hours}:${newMinutes}`;
      }

      if (+newMinutes >= 60) {
        inputElement.value = `${hours}:0${key}`;
      }
    }
  };

  const handleDelete = () => {
    const inputElement = inputRef.current;

    const selectionStart = inputElement.selectionStart || 0;
    const colonPosition = inputElement.value.indexOf(':');

    const [hours, minutes] = inputElement.value.split(':');

    // hours delete
    if (selectionStart < colonPosition) {
      inputElement.value = `0:${minutes}`;
    }

    // minutes delete
    if (selectionStart > colonPosition) {
      inputElement.value = `${hours}:00`;
    }
  };

  const handleArrowWheel = (type: 'increase' | 'decrease') => {
    const inputElement = inputRef.current;

    const selectionStart = inputElement.selectionStart || 0;
    const colonPosition = inputElement.value.indexOf(':');

    const [hours, minutes] = inputElement.value.split(':');

    // update hours
    if (selectionStart < colonPosition) {
      if (type === 'increase') {
        const newHours = +hours + 1;
        const limit = hoursLength === 3 ? 1000 : 100;

        if (newHours < limit) {
          inputElement.value = `${newHours}:${minutes}`;
        }

        if (newHours === limit) {
          inputElement.value = `0:${minutes}`;
        }
      }

      if (type === 'decrease') {
        const newHours = +hours - 1;
        if (newHours > -1) {
          inputElement.value = `${newHours}:${minutes}`;
        }

        if (newHours === -1) {
          inputElement.value = `0:${minutes}`;
        }
      }
    }

    // update minutes
    if (selectionStart > colonPosition) {
      if (type === 'increase') {
        const newMinutes = +minutes + 1;
        if (newMinutes < 60) {
          inputElement.value = `${hours}:${String(newMinutes).padStart(2, '0')}`;
        }

        if (newMinutes === 60) {
          inputElement.value = `${hours}:00`;
        }
      }

      if (type === 'decrease') {
        const newMinutes = +minutes - 1;
        if (newMinutes > -1) {
          inputElement.value = `${hours}:${String(newMinutes).padStart(2, '0')}`;
        }

        if (newMinutes === -1) {
          inputElement.value = `${hours}:59`;
        }
      }
    }
  };

  const handleArrowUpDown = (type: 'ArrowUp' | 'ArrowDown') => {
    const value = type === 'ArrowUp' ? 'increase' : 'decrease';

    handleArrowWheel(value);
  };

  const handleWheel = (e: WheelEvent<HTMLInputElement>) => {
    const inputElement = inputRef.current;

    const selectionStart = inputElement.selectionStart || 0;

    const value = e.deltaY < 0 ? 'increase' : 'decrease';

    handleArrowWheel(value);

    onChange?.(inputElement.value);

    // restore selection
    inputElement.setSelectionRange(selectionStart, selectionStart);
    handleClick();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const inputElement = inputRef.current;

    const selectionStart = inputElement.selectionStart || 0;
    const colonPosition = inputElement.value.indexOf(':');

    // handle digits typed, append or truncate
    if (e.key.match(/\d/)) {
      handleDigitsTyped(e.key);
      onChange?.(inputElement.value);

      // restore selection
      inputElement.setSelectionRange(selectionStart, selectionStart);
    }

    // handle delete
    if (['Delete', 'Backspace'].includes(e.key)) {
      handleDelete();
      onChange?.(inputElement.value);

      // restore selection
      inputElement.setSelectionRange(selectionStart, selectionStart);
    }

    // handle ArrowLeft
    if (e.key === 'ArrowLeft') {
      inputElement.setSelectionRange(0, 0);
    }

    // handle ArrowRight
    if (e.key === 'ArrowRight') {
      inputElement.setSelectionRange(colonPosition + 1, colonPosition + 1);
    }

    // handle ArrowUp and ArrowDown
    if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
      handleArrowUpDown(e.key as 'ArrowUp' | 'ArrowDown');
      onChange?.(inputElement.value);

      // restore selection
      inputElement.setSelectionRange(selectionStart, selectionStart);
    }

    handleClick();

    // stop default behavior
    e.preventDefault();
  };

  useEffect(() => {
    inputRef.current.value = value || '';
  }, [value]);

  return {
    inputRef,
    handleKeyDown,
    handleClick,
    handleBlur,
    handleWheel,
  };
};

export default useTimeField;
