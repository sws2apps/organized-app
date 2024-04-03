import { Box } from '@mui/material';

import { StyledBox, StyledModalWindowContainer, StyledRowContainer } from './add_service_time_modal_window.styled';
import { AddServieTimeModalWindowProps } from './add_service_time_modal_window.types';
import useAppTranslation from '@hooks/useAppTranslation';

import CustomTypography from '@components/typography';
import DatePicker from '@components/date_picker';
import MinusButton from '@components/minus_button';
import PlusButton from '@components/plus_button';
import Button from '@components/button';
import { useEffect, useRef, useState } from 'react';
import { CustomDropdownContainer, CustomDropdownMenu } from './components/custom_dropdown';

export const AddServiceTimeModalWindow = (props: AddServieTimeModalWindowProps) => {
  const duration = props.duration || '00:00';
  const variant = props.variant || 'simple';

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

  const [localDurationInSeconds, setLocalDurationInSeconds] = useState(() => convertDurationStringToSeconds(duration));

  const incrementDuration = () => {
    setLocalDurationInSeconds(localDurationInSeconds + 60);
  };

  const decrimentDuration = () => {
    if (convertDurationInSecondsToString(localDurationInSeconds) != '00:00') {
      setLocalDurationInSeconds(localDurationInSeconds - 60);
    }
  };

  const [localCreditHoursDurationInSeconds, setLocalCreditHoursDurationInSeconds] = useState(() =>
    convertDurationStringToSeconds(duration)
  );

  const incrementCreditHoursDuration = () => {
    setLocalDurationInSeconds(localDurationInSeconds + 60);
  };

  const decrimentCreditHoursDuration = () => {
    if (convertDurationInSecondsToString(localDurationInSeconds) != '00:00') {
      setLocalDurationInSeconds(localDurationInSeconds - 60);
    }
  };

  const [countOfStudies, setCountOfStudies] = useState(0);

  const incrementCountOfStudies = () => {
    setCountOfStudies(countOfStudies + 1);
  };

  const decrimentCountOfStudies = () => {
    if (countOfStudies !== 0) {
      setCountOfStudies(countOfStudies - 1);
    }
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleCustomDropdownContainerClick = () => {
    setDropdownOpen((previous) => !previous);
  };

  const styledRowContainerWithBibleStudiesRef = useRef(null);

  let dropdownCheckedItems = [];

  useEffect(() => {
    console.log('page redmd');
  }, []);

  return (
    <StyledModalWindowContainer>
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
      <StyledRowContainer sx={{ justifyContent: 'space-between', flexDirection: 'column', alignItems: 'stretch' }}>
        <StyledBox>
          <CustomTypography className="body-regular">{t('tr_hours')}</CustomTypography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '168px', alignItems: 'center' }}>
            <MinusButton onClick={decrimentDuration} />
            <CustomTypography className="h2">
              {convertDurationInSecondsToString(localDurationInSeconds)}
            </CustomTypography>
            <PlusButton onClick={incrementDuration} />
          </Box>
        </StyledBox>
        {variant == 'pioneer' ? (
          <StyledBox>
            <CustomTypography className="body-regular">{t('tr_creditHours')}</CustomTypography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '168px', alignItems: 'center' }}>
              <MinusButton onClick={decrimentCreditHoursDuration} />
              <CustomTypography className="h2">
                {convertDurationInSecondsToString(localCreditHoursDurationInSeconds)}
              </CustomTypography>
              <PlusButton onClick={incrementCreditHoursDuration} />
            </Box>
          </StyledBox>
        ) : null}
      </StyledRowContainer>
      <StyledRowContainer ref={styledRowContainerWithBibleStudiesRef} sx={{ alignItems: 'center' }}>
        <CustomDropdownContainer
          label={t('tr_bibleStudies')}
          onClick={() => {
            handleCustomDropdownContainerClick();
          }}
        />
        <CustomDropdownMenu
          open={dropdownOpen}
          labelAdd={t('tr_addNewStudy')}
          items={props.bibleStudiesList}
          checkedItems={(value) => (dropdownCheckedItems = value)}
          width={styledRowContainerWithBibleStudiesRef.current?.offsetWidth + 'px'}
          anchorElement={styledRowContainerWithBibleStudiesRef.current}
          editIconClicked={(item_index, item_text) => {
            // TODO: Open edit window
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '168px', alignItems: 'center' }}>
          <MinusButton onClick={decrimentCountOfStudies} />
          <CustomTypography className="h2">{countOfStudies}</CustomTypography>
          <PlusButton onClick={incrementCountOfStudies} />
        </Box>
      </StyledRowContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Button variant="secondary">{t('tr_cancel')}</Button>
        <Button variant="main">{t('tr_add')}</Button>
      </Box>
    </StyledModalWindowContainer>
  );
};

export default AddServiceTimeModalWindow;
