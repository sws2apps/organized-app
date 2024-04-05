import { Box, TextField } from '@mui/material';

import { StyledBox, StyledModalWindowContainer, StyledRowContainer } from './add_service_time_modal_window.styled';
import { AddServieTimeModalWindowProps } from './add_service_time_modal_window.types';
import useAppTranslation from '@hooks/useAppTranslation';

import CustomTypography from '@components/typography';
import DatePicker from '@components/date_picker';
import MinusButton from '@components/minus_button';
import PlusButton from '@components/plus_button';
import Button from '@components/button';
import { useRef, useState } from 'react';
import { CustomDropdownContainer, CustomDropdownMenu } from '@components/dropdown';

export const AddServiceTimeModalWindow = (props: AddServieTimeModalWindowProps) => {
  const duration = props.duration;
  const variant = props.variant || 'simple';
  const showCreditHours = props.showCreditHours || false;

  const { t } = useAppTranslation();

  /**
   * Converts a duration string in the format 'HH:MM' to seconds.
   * @param {string} duration - The duration string to convert.
   * @returns {number} The duration in seconds.
   */
  const convertDurationStringToSeconds = (duration: string): number => {
    const [hours, minutes] = duration.split(':');
    return parseInt(hours) * 3600 + parseInt(minutes) * 60;
  };

  /**
   * Converts a duration in seconds to a string format 'HH:MM'.
   * @param {number} seconds - The duration in seconds to convert.
   * @returns {string} The duration string in 'HH:MM' format.
   */
  const convertDurationInSecondsToString = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours === 0 && minutes === 0) {
      return '00:00';
    }

    const formattedHours = hours < 10 ? '0' + hours.toString() : hours.toString();
    const formattedMinutes = minutes < 10 ? '0' + minutes.toString() : minutes.toString();

    return `${formattedHours}:${formattedMinutes}`;
  };

  function convertHoursToSeconds(hours: number): number {
    return hours * 3600;
  }

  const [localDurationInSeconds, setLocalDurationInSeconds] = useState(duration);

  const incrementDuration = () => {
    setLocalDurationInSeconds(localDurationInSeconds + 3600);
  };

  const decrimentDuration = () => {
    if (convertDurationInSecondsToString(localDurationInSeconds) != '00:00') {
      setLocalDurationInSeconds(localDurationInSeconds - 3600);
    }
  };

  const [localCreditHoursDurationInSeconds, setLocalCreditHoursDurationInSeconds] = useState(0);

  const [countOfStudies, setCountOfStudies] = useState(0);

  const incrementCountOfStudies = () => {
    setCountOfStudies(countOfStudies + 1);
  };

  const decrimentCountOfStudies = () => {
    if (countOfStudies !== 0) {
      setCountOfStudies(countOfStudies - 1);
    }
  };

  const [dropdownWithStudiesOpen, setDropdownWithStudiesOpen] = useState(false);
  const [dropdownWithSchoolsOpen, setDropdownWithSchoolsOpen] = useState(false);

  const styledRowContainerWithBibleStudiesRef = useRef(null);
  const styledRowContainerWithCreditHours = useRef(null);
  const thisModalWindow = useRef(null);

  let dropdownCheckedItems = [];

  return (
    <StyledModalWindowContainer ref={thisModalWindow}>
      <Box>
        <CustomTypography className="h2">{t('tr_addServiceTime')}</CustomTypography>
        <Box
          sx={{
            marginTop: '8px',
            '.MuiButtonBase-root': { padding: 0 },
            '.MuiButtonBase-root:hover': { backgroundColor: 'transparent' },
          }}
        >
          <DatePicker view={'button'} />
        </Box>
      </Box>
      <StyledRowContainer
        sx={{ justifyContent: 'space-between', flexDirection: 'column', alignItems: 'stretch' }}
        ref={styledRowContainerWithCreditHours}
      >
        <StyledBox>
          <CustomTypography className="body-regular">{t('tr_hours')}</CustomTypography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '168px', alignItems: 'center' }}>
            <MinusButton onClick={decrimentDuration} />
            <TextField
              id="standard-basic"
              variant="standard"
              sx={{
                '.MuiInputBase-root::after, .MuiInputBase-root::before': { content: 'none' },
                '.MuiInputBase-root': {
                  color:
                    convertDurationInSecondsToString(localDurationInSeconds) != '00:00'
                      ? 'var(--black)'
                      : 'var(--grey-300)',
                },
                '.MuiInput-input': {
                  textAlign: 'center',
                  fontWeight: '550',
                  fontFamily: 'Inter',
                  lineHeight: '24px',
                },
              }}
              defaultValue={convertDurationInSecondsToString(localDurationInSeconds)}
            />
            <PlusButton onClick={incrementDuration} />
          </Box>
        </StyledBox>
        {variant == 'pioneer' && showCreditHours ? (
          <StyledBox>
            <CustomDropdownContainer
              label={t('tr_creditHours')}
              onClick={() => setDropdownWithStudiesOpen((prev) => !prev)}
            />
            <CustomDropdownMenu
              variant="schools"
              anchorElement={styledRowContainerWithCreditHours.current}
              width={styledRowContainerWithCreditHours.current?.offsetWidth + 'px'}
              open={dropdownWithStudiesOpen}
              zIndex={(theme) => theme.zIndex.drawer + 3}
              callback={(value) => {
                setLocalCreditHoursDurationInSeconds(convertHoursToSeconds(value));
              }}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '168px', alignItems: 'center' }}>
              <MinusButton />
              <CustomTypography
                className="h2"
                color={
                  convertDurationInSecondsToString(localCreditHoursDurationInSeconds) != '00:00'
                    ? 'var(--black)'
                    : 'var(--grey-300)'
                }
              >
                {convertDurationInSecondsToString(localCreditHoursDurationInSeconds)}
              </CustomTypography>
              <PlusButton />
            </Box>
          </StyledBox>
        ) : null}
      </StyledRowContainer>
      <StyledRowContainer ref={styledRowContainerWithBibleStudiesRef} sx={{ alignItems: 'center' }}>
        <CustomDropdownContainer
          label={t('tr_bibleStudies')}
          onClick={() => setDropdownWithSchoolsOpen((prev) => !prev)}
        />
        <CustomDropdownMenu
          variant="studies"
          open={dropdownWithSchoolsOpen}
          items={props.bibleStudiesList}
          zIndex={(theme) => theme.zIndex.drawer + 3}
          callback={(value) => (dropdownCheckedItems = value)}
          width={styledRowContainerWithBibleStudiesRef.current?.offsetWidth + 'px'}
          anchorElement={styledRowContainerWithBibleStudiesRef.current}
          editItemButtonClick={(item_index, item_text) => {
            // TODO: Open edit window
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '168px', alignItems: 'center' }}>
          <MinusButton onClick={decrimentCountOfStudies} />
          <CustomTypography className="h2" color={countOfStudies != 0 ? 'var(--black)' : 'var(--grey-300)'}>
            {countOfStudies}
          </CustomTypography>
          <PlusButton onClick={incrementCountOfStudies} />
        </Box>
      </StyledRowContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Button variant="secondary" onClick={props.cancelButtonClick}>
          {t('tr_cancel')}
        </Button>
        <Button variant="main" onClick={props.addButtonClick}>
          {t('tr_add')}
        </Button>
      </Box>
    </StyledModalWindowContainer>
  );
};

export default AddServiceTimeModalWindow;
