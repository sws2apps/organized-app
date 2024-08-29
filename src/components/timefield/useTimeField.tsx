import { KeyboardEvent, useEffect, useRef } from 'react';
import { TimeFieldProps } from './index.types';

const useTimeField = ({ value, onChange }: TimeFieldProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleBlur = () => {
    const inputElement = inputRef.current;

    if (inputElement.value === 'H:MM') {
      inputElement.value = '';
    }
  };

  const handleClick = () => {
    const inputElement = inputRef.current;

    // If blank set default value and select hours part
    if (inputElement.value === '') {
      inputElement.value = 'H:MM';
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
      if (hours.length < 3) {
        if (hours === 'H') {
          inputElement.value = `${key}:${minutes}`;

          if (minutes === 'MM') {
            inputElement.value = inputElement.value.replace('MM', '00');
          }
        }

        if (hours !== 'H') {
          const currentHours = +hours;

          if (currentHours === 0) {
            inputElement.value = `${key}:${minutes}`;
          }

          if (currentHours > 0) {
            inputElement.value = `${hours}${key}:${minutes}`;
          }
        }
      }

      if (hours.length === 3) {
        inputElement.value = `${key}:${minutes}`;
      }
    }

    // update minutes
    if (selectionStart > colonPosition) {
      if (minutes === 'MM') {
        inputElement.value = `${hours}:0${key}`;

        if (hours === 'H') {
          inputElement.value = inputElement.value.replace('H', '0');
        }
      }

      if (minutes !== 'MM') {
        const newMinutes = String(`${minutes}${key}`).slice(-2);

        if (+newMinutes < 60) {
          inputElement.value = `${hours}:${newMinutes}`;
        }

        if (+newMinutes >= 60) {
          inputElement.value = `${hours}:0${key}`;
        }
      }
    }
  };

  const handleDelete = () => {
    const inputElement = inputRef.current;

    const selectionStart = inputElement.selectionStart || 0;
    const colonPosition = inputElement.value.indexOf(':');

    const [hours, minutes] = inputElement.value.split(':');

    // hours delete
    if (selectionStart < colonPosition && hours !== 'H') {
      inputElement.value = `0:${minutes}`;
    }

    // minutes delete
    if (selectionStart > colonPosition && minutes !== 'MM') {
      inputElement.value = `${hours}:00`;
    }
  };

  const handleArrowUpDown = (type: 'ArrowUp' | 'ArrowDown') => {
    const inputElement = inputRef.current;

    const selectionStart = inputElement.selectionStart || 0;
    const colonPosition = inputElement.value.indexOf(':');

    const [hours, minutes] = inputElement.value.split(':');

    // update hours
    if (selectionStart < colonPosition) {
      if (type === 'ArrowUp') {
        if (hours === 'H') {
          inputElement.value = inputElement.value.replace('H', '1');

          if (minutes === 'MM') {
            inputElement.value = inputElement.value.replace('MM', '00');
          }
        }

        if (hours !== 'H') {
          const newHours = +hours + 1;
          if (newHours < 1000) {
            inputElement.value = `${newHours}:${minutes}`;
          }

          if (newHours === 1000) {
            inputElement.value = `0:${minutes}`;
          }
        }
      }

      if (type === 'ArrowDown') {
        if (hours === 'H') {
          inputElement.value = inputElement.value.replace('H', '0');

          if (minutes === 'MM') {
            inputElement.value = inputElement.value.replace('MM', '00');
          }
        }

        if (hours !== 'H') {
          const newHours = +hours - 1;
          if (newHours > -1) {
            inputElement.value = `${newHours}:${minutes}`;
          }

          if (newHours === -1) {
            inputElement.value = `0:${minutes}`;
          }
        }
      }
    }

    // update minutes
    if (selectionStart > colonPosition) {
      if (type === 'ArrowUp') {
        if (minutes === 'MM') {
          inputElement.value = inputElement.value.replace('MM', '01');

          if (hours === 'H') {
            inputElement.value = inputElement.value.replace('H', '0');
          }
        }

        if (minutes !== 'MM') {
          const newMinutes = +minutes + 1;
          if (newMinutes < 60) {
            inputElement.value = `${hours}:${String(newMinutes).padStart(2, '0')}`;
          }

          if (newMinutes === 60) {
            inputElement.value = `${hours}:00`;
          }
        }
      }

      if (type === 'ArrowDown') {
        if (minutes === 'MM') {
          inputElement.value = inputElement.value.replace('MM', '00');

          if (hours === 'H') {
            inputElement.value = inputElement.value.replace('H', '0');
          }
        }

        if (minutes !== 'MM') {
          const newMinutes = +minutes - 1;
          if (newMinutes > -1) {
            inputElement.value = `${hours}:${String(newMinutes).padStart(2, '0')}`;
          }

          if (newMinutes === -1) {
            inputElement.value = `${hours}:59`;
          }
        }
      }
    }
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
  };
};

export default useTimeField;
