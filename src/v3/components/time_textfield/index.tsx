import { Box } from '@mui/material';
import { CustomTimeTextfieldProps } from './time_textfield.types';
import { useEffect, useState } from 'react';
import CustomTypography from '@components/typography';
import { StyledSmallTextField } from './time_textfield.styles';

const CustomTimeTextfield = (props: CustomTimeTextfieldProps) => {
  const delimiter = props.delimiter || ':';
  const format = props.format || 'hh:mm';
  const timeFormat = props.timeFormat || '12';

  const hoursMax = timeFormat == '12' ? 12 : 24;
  const minutesAndSecondsMax = 60;

  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

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

  const numberToTimeFormat = (number: number): string => {
    if (number >= 10) {
      return number.toString();
    } else {
      return `0${number}`;
    }
  };

  switch (format) {
    case 'hh:mm':
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <StyledSmallTextField
            value={numberToTimeFormat(hours)}
            id="standard-basic"
            variant="standard"
            fontColor={numberToTimeFormat(hours) == '00' ? 'var(--grey-300)' : 'var(--black)'}
            onChange={(event) => {
              const tmpHours = Number(event.target.value);
              if (tmpHours >= hoursMax) {
                setHours(hoursMax);
              } else {
                setHours(tmpHours);
              }
            }}
            inputMode="numeric"
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
          <StyledSmallTextField
            value={numberToTimeFormat(minutes)}
            id="standard-basic"
            variant="standard"
            fontColor={numberToTimeFormat(minutes) == '00' ? 'var(--grey-300)' : 'var(--black)'}
            inputMode="numeric"
            onChange={(event) => {
              const tmpMinutes = Number(event.target.value);
              if (tmpMinutes >= minutesAndSecondsMax) {
                setMinutes(minutesAndSecondsMax);
              } else {
                setMinutes(tmpMinutes);
              }
            }}
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
          <StyledSmallTextField
            value={numberToTimeFormat(minutes)}
            id="standard-basic"
            variant="standard"
            fontColor={numberToTimeFormat(minutes) == '00' ? 'var(--grey-300)' : 'var(--black)'}
            inputMode="numeric"
            onChange={(event) => {
              const tmpMinutes = Number(event.target.value);
              if (tmpMinutes >= minutesAndSecondsMax) {
                setMinutes(minutesAndSecondsMax);
              } else {
                setMinutes(tmpMinutes);
              }
            }}
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
          <StyledSmallTextField
            value={numberToTimeFormat(seconds)}
            id="standard-basic"
            variant="standard"
            fontColor={numberToTimeFormat(seconds) == '00' ? 'var(--grey-300)' : 'var(--black)'}
            inputMode="numeric"
            onChange={(event) => {
              const tmpSeconds = Number(event.target.value);
              if (tmpSeconds >= minutesAndSecondsMax) {
                setSeconds(minutesAndSecondsMax);
              } else {
                setSeconds(tmpSeconds);
              }
            }}
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
          <StyledSmallTextField
            value={numberToTimeFormat(hours)}
            id="standard-basic"
            variant="standard"
            fontColor={numberToTimeFormat(hours) == '00' ? 'var(--grey-300)' : 'var(--black)'}
            inputMode="numeric"
            onChange={(event) => {
              const tmpHours = Number(event.target.value);
              if (tmpHours >= hoursMax) {
                setHours(hoursMax);
              } else {
                setHours(tmpHours);
              }
            }}
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
          <StyledSmallTextField
            value={numberToTimeFormat(minutes)}
            id="standard-basic"
            variant="standard"
            fontColor={numberToTimeFormat(minutes) == '00' ? 'var(--grey-300)' : 'var(--black)'}
            inputMode="numeric"
            onChange={(event) => {
              const tmpMinutes = Number(event.target.value);
              if (tmpMinutes >= minutesAndSecondsMax) {
                setMinutes(minutesAndSecondsMax);
              } else {
                setMinutes(tmpMinutes);
              }
            }}
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
          <StyledSmallTextField
            value={numberToTimeFormat(seconds)}
            id="standard-basic"
            variant="standard"
            fontColor={numberToTimeFormat(seconds) == '00' ? 'var(--grey-300)' : 'var(--black)'}
            inputMode="numeric"
            onChange={(event) => {
              const tmpSeconds = Number(event.target.value);
              if (tmpSeconds >= minutesAndSecondsMax) {
                setSeconds(minutesAndSecondsMax);
              } else {
                setSeconds(tmpSeconds);
              }
            }}
          />
        </Box>
      );
  }
};

export default CustomTimeTextfield;
