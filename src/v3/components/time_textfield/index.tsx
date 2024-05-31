import { Box } from '@mui/material';
import { CustomSmallTimeTextFieldProps, CustomTimeTextFieldProps, TimeMaxs } from './time_textfield.types';
import { useEffect, useRef, useState } from 'react';
import CustomTypography from '@components/typography';
import { StyledSmallTextField } from './time_textfield.styles';

/**
 * Formats a number to a time string with leading zero if needed.
 * @param {number} number - The number to format.
 * @returns {string} - The formatted time string.
 */
const numberToTimeFormat = (number: number): string => {
  if (number >= 10) {
    return number.toString();
  } else {
    return `0${number}`;
  }
};

/**
 * CustomSmallTimeTextField component
 *
 * @param {CustomSmallTimeTextFieldProps} props - The properties for the CustomSmallTimeTextField component.
 * @returns {JSX.Element} - The rendered CustomSmallTimeTextField component.
 */
const CustomSmallTimeTextField = (props: CustomSmallTimeTextFieldProps) => {
  const maxValue = props.maxValue || 360;

  return (
    <StyledSmallTextField
      ref={props.reference}
      fontColor={numberToTimeFormat(props.value) == '00' ? 'var(--grey-300)' : 'var(--black)'}
      onKeyDown={(event) => {
        if (event.keyCode == 13) {
          if (props.nextElementRef) {
            const nextElement: HTMLElement = props.nextElementRef.current;
            const nextInput = nextElement.getElementsByTagName('input')[0];
            nextInput.focus();
          } else {
            const currentElement: HTMLElement = props.reference.current;
            const currentInput = currentElement.getElementsByTagName('input')[0];
            currentInput.blur();
          }
        }
      }}
      value={numberToTimeFormat(props.value)}
      id="standard-basic"
      type="number"
      variant="standard"
      onChange={(event) => {
        const tmpValue = Number(event.target.value);

        if (tmpValue >= maxValue) {
          props.setTimeFunc(maxValue);
        } else {
          props.setTimeFunc(tmpValue);
        }
      }}
    />
  );
};

/**
 * CustomTimeTextField component renders a time input field with customizable format and delimiter.
 *
 * @param {CustomTimeTextFieldProps} props - The properties for the CustomTimeTextField component.
 * @returns {JSX.Element} The CustomTimeTextField component.
 */
const CustomTimeTextField = (props: CustomTimeTextFieldProps) => {
  const delimiter = props.delimiter || ':';
  const format = props.format || 'hh:mm';
  const timeFormat = props.timeFormat || '12';

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  // Used for changing focus on element
  const hoursInputRef = useRef(null);
  const minutesInputRef = useRef(null);
  const secondsInputRef = useRef(null);

  useEffect(() => {
    setHours(props.hours);
  }, [props.hours]);

  useEffect(() => {
    setMinutes(props.minutes);
  }, [props.minutes]);

  useEffect(() => {
    setSeconds(props.seconds);
  }, [props.seconds]);

  useEffect(() => {
    props.onChange(hours, minutes, seconds);
  }, [hours, minutes, props, seconds]);

  switch (format) {
    case 'hh:mm':
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <CustomSmallTimeTextField
            value={hours}
            reference={hoursInputRef}
            nextElementRef={minutesInputRef}
            setTimeFunc={setHours}
            maxValue={timeFormat == '12' ? TimeMaxs.hours[0] : TimeMaxs.hours[1]}
          />
          <CustomTypography
            className="h3"
            color={
              numberToTimeFormat(hours) == '00' && numberToTimeFormat(minutes) == '00'
                ? 'var(--grey-300)'
                : 'var(--black)'
            }
          >
            {delimiter}
          </CustomTypography>
          <CustomSmallTimeTextField
            value={minutes}
            reference={minutesInputRef}
            setTimeFunc={setMinutes}
            maxValue={TimeMaxs.minutes}
          />
        </Box>
      );
    case 'mm:ss':
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <CustomSmallTimeTextField
            value={minutes}
            reference={minutesInputRef}
            nextElementRef={secondsInputRef}
            setTimeFunc={setMinutes}
            maxValue={TimeMaxs.minutes}
          />
          <CustomTypography
            className="h3"
            color={
              numberToTimeFormat(minutes) == '00' && numberToTimeFormat(seconds) == '00'
                ? 'var(--grey-300)'
                : 'var(--black)'
            }
          >
            {delimiter}
          </CustomTypography>
          <CustomSmallTimeTextField
            value={seconds}
            reference={secondsInputRef}
            setTimeFunc={setSeconds}
            maxValue={TimeMaxs.seconds}
          />
        </Box>
      );
    case 'hh:mm:ss':
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <CustomSmallTimeTextField
            value={hours}
            reference={hoursInputRef}
            nextElementRef={minutesInputRef}
            setTimeFunc={setHours}
            maxValue={timeFormat == '12' ? TimeMaxs.hours[0] : TimeMaxs.hours[1]}
          />
          <CustomTypography
            className="h3"
            color={
              numberToTimeFormat(hours) == '00' &&
              numberToTimeFormat(minutes) == '00' &&
              numberToTimeFormat(seconds) == '00'
                ? 'var(--grey-300)'
                : 'var(--black)'
            }
          >
            {delimiter}
          </CustomTypography>
          <CustomSmallTimeTextField
            value={minutes}
            reference={minutesInputRef}
            nextElementRef={secondsInputRef}
            setTimeFunc={setMinutes}
            maxValue={TimeMaxs.minutes}
          />
          <CustomTypography
            className="h3"
            color={
              numberToTimeFormat(hours) == '00' &&
              numberToTimeFormat(minutes) == '00' &&
              numberToTimeFormat(seconds) == '00'
                ? 'var(--grey-300)'
                : 'var(--black)'
            }
          >
            {delimiter}
          </CustomTypography>
          <CustomSmallTimeTextField
            value={minutes}
            reference={minutesInputRef}
            setTimeFunc={setMinutes}
            maxValue={TimeMaxs.minutes}
          />
        </Box>
      );
  }
};

export default CustomTimeTextField;
