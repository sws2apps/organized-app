import { Box, TextField } from '@mui/material';

import { StyledBox, StyledModalWindowContainer, StyledRowContainer } from './add_service_time_modal_window.styled';
import { AddServiceTimeModalWindowProps } from './add_service_time_modal_window.types';
import useAppTranslation from '@hooks/useAppTranslation';

import CustomTypography from '@components/typography';
import DatePicker from '@components/date_picker';
import MinusButton from '@components/minus_button';
import PlusButton from '@components/plus_button';

import { useContext, useEffect, useRef, useState } from 'react';
import { CustomDropdownContainer, CustomDropdownItem, CustomDropdownMenu } from '@components/dropdown';
import { IconAdd, IconLanguageCourse, IconPersonalDay, IconSchool, IconSchoolForEvangelizers } from '@components/icons';
import { hoursToSeconds } from 'date-fns';
import { EditAndAddBibleStudyContext } from '../EditAndAddBibleStudyContext';
import CustomButton from '@components/button';

/**
 * Add Service Time Modal Window component.
 */
export const AddServiceTimeModalWindow = (props: AddServiceTimeModalWindowProps) => {
  const variant = props.variant || 'simple';
  const showCreditHours = props.showCreditHours || false;

  const { editAndAddBibleStudyData, setEditAndAddBibleStudyData } = useContext(EditAndAddBibleStudyContext);

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

  const [localDurationInSeconds, setLocalDurationInSeconds] = useState(0);

  useEffect(() => {
    setLocalDurationInSeconds(props.duration);
  }, [props.duration]);

  const incrementDuration = () => {
    setLocalDurationInSeconds(localDurationInSeconds + 3600);
  };

  const decrimentDuration = () => {
    if (convertDurationInSecondsToString(localDurationInSeconds) != '00:00') {
      setLocalDurationInSeconds(localDurationInSeconds - 3600);
    }
  };

  const [localCreditHoursDurationInSeconds, setLocalCreditHoursDurationInSeconds] = useState(0);

  const incrementCreditHoursDuration = () => {
    setLocalCreditHoursDurationInSeconds(localCreditHoursDurationInSeconds + 3600);
  };
  const decrimentCreditHoursDuration = () => {
    if (convertDurationInSecondsToString(localCreditHoursDurationInSeconds) != '00:00') {
      setLocalCreditHoursDurationInSeconds(localCreditHoursDurationInSeconds - 3600);
    }
  };

  const [dropdownWithStudiesOpen, setDropdownWithStudiesOpen] = useState(false);
  const [dropdownWithSchoolsOpen, setDropdownWithSchoolsOpen] = useState(false);

  const dropdownWithStudiesReference = useRef(null);
  const dropdownWithSchoolsReference = useRef(null);
  const dropdownWithStudiesOpenButtonReference = useRef(null);
  const dropdownWithSchoolsOpenButtonReference = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownWithStudiesOpenButtonReference.current &&
        !dropdownWithStudiesOpenButtonReference.current.contains(event.target) &&
        dropdownWithStudiesOpen &&
        dropdownWithStudiesReference.current &&
        !dropdownWithStudiesReference.current.contains(event.target)
      ) {
        setDropdownWithStudiesOpen(false);
      }

      if (
        dropdownWithSchoolsOpenButtonReference.current &&
        !dropdownWithSchoolsOpenButtonReference.current.contains(event.target) &&
        dropdownWithSchoolsOpen &&
        dropdownWithSchoolsReference.current &&
        !dropdownWithSchoolsReference.current.contains(event.target)
      ) {
        setDropdownWithSchoolsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownWithStudiesOpen, dropdownWithSchoolsOpen]);

  const styledRowContainerWithBibleStudiesRef = useRef(null);
  const styledRowContainerWithCreditHours = useRef(null);

  const [countOfStudies, setCountOfStudies] = useState(0);

  const incrementCountOfStudies = () => {
    setCountOfStudies(countOfStudies + 1);
  };

  const decrimentCountOfStudies = () => {
    if (countOfStudies != 0) {
      setCountOfStudies(countOfStudies - 1);
    }
  };

  const [checkedLocalStudiesStatesList, setCheckedLocalStudiesStatesList] = useState(() => {
    return Array<boolean>(props.bibleStudiesList.length).fill(false);
  });

  const getArrayWithCheckedStudies = (): string[] => {
    const tmpArray = [];

    props.bibleStudiesList.forEach((value, index) => {
      if (checkedLocalStudiesStatesList[index]) {
        tmpArray.push(props.bibleStudiesList[index]);
      }
    });

    return tmpArray;
  };

  const [localDate, setLocalDate] = useState<Date>(null);

  // code for fix bug with empty field
  useEffect(() => {
    if (convertDurationInSecondsToString(localDurationInSeconds) === 'NaN:NaN') {
      setLocalDurationInSeconds(0);
    }

    if (convertDurationInSecondsToString(localCreditHoursDurationInSeconds) === 'NaN:NaN') {
      setLocalCreditHoursDurationInSeconds(0);
    }
  }, [localDurationInSeconds, localCreditHoursDurationInSeconds]);

  useEffect(() => {
    let studiesCounter = 0;
    props.bibleStudiesList.forEach((value, index) => {
      if (checkedLocalStudiesStatesList[index]) {
        studiesCounter++;
      }
    });

    setCountOfStudies(studiesCounter);
  }, [checkedLocalStudiesStatesList, props.bibleStudiesList]);

  return (
    <StyledModalWindowContainer
      ref={props.reference}
      className="pop-up-shadow"
      sx={{
        marginLeft: { mobile: '16px', tablet: '24px', desktop: '32px' },
        marginRight: { mobile: '16px', tablet: '24px', desktop: '32px' },
        marginTop: '16px',
        marginBottom: '16px',
      }}
    >
      <Box>
        <CustomTypography className="h2">{t('tr_addServiceTime')}</CustomTypography>
        <Box
          sx={{
            marginTop: '8px',
            '.MuiButtonBase-root': { padding: 0 },
            '.MuiButtonBase-root:hover': { backgroundColor: 'transparent' },
          }}
        >
          <DatePicker view={'button'} onChange={async (value) => setLocalDate(value)} value={new Date()} />
        </Box>
      </Box>
      <StyledRowContainer
        sx={{ justifyContent: 'space-between', flexDirection: 'column', alignItems: 'stretch' }}
        ref={styledRowContainerWithCreditHours}
      >
        <StyledBox>
          <CustomTypography className="body-regular">{t('tr_hours')}</CustomTypography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              minWidth: '168px',
              maxWidth: '168px',
              alignItems: 'center',
            }}
          >
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
              value={convertDurationInSecondsToString(localDurationInSeconds)}
              onChange={(event) => {
                setLocalDurationInSeconds(convertDurationStringToSeconds(event.target.value));
              }}
            />
            <PlusButton onClick={incrementDuration} />
          </Box>
        </StyledBox>
        {variant == 'pioneer' && showCreditHours ? (
          <StyledBox>
            <CustomDropdownContainer
              open={dropdownWithSchoolsOpen}
              label={t('tr_creditHours')}
              onClick={() => setDropdownWithSchoolsOpen((prev) => !prev)}
              reference={dropdownWithSchoolsOpenButtonReference}
            />

            <CustomDropdownMenu
              reference={dropdownWithSchoolsReference}
              open={dropdownWithSchoolsOpen}
              anchorElement={styledRowContainerWithCreditHours.current}
              width={styledRowContainerWithCreditHours.current?.offsetWidth + 'px'}
              zIndex={(theme) => theme.zIndex.drawer + 3}
            >
              <CustomDropdownItem
                variant="schools"
                label={t('tr_pioneerSchool')}
                description={t('tr_ministryTimeHours', { ministryTime: 30 })}
                icon={<IconSchool />}
                checked={false}
                callback={() => setLocalCreditHoursDurationInSeconds(hoursToSeconds(30))}
              />
              <CustomDropdownItem
                variant="schools"
                label={t('tr_SKE')}
                description={t('tr_ministryTimeHours', { ministryTime: 80 })}
                icon={<IconSchoolForEvangelizers />}
                checked={false}
                callback={() => setLocalCreditHoursDurationInSeconds(hoursToSeconds(80))}
              />
              <CustomDropdownItem
                variant="schools"
                label={t('tr_languageCourse')}
                description={t('tr_ministryTimeHours', { ministryTime: 25 })}
                icon={<IconLanguageCourse />}
                checked={false}
                callback={() => setLocalCreditHoursDurationInSeconds(hoursToSeconds(25))}
              />
              <CustomDropdownItem
                variant="schools"
                label={t('tr_personalDay')}
                description={t('tr_ministryTimeHours', { ministryTime: 5 })}
                icon={<IconPersonalDay />}
                checked={false}
                sx={{
                  borderBottom: 'none',
                }}
                callback={() => setLocalCreditHoursDurationInSeconds(hoursToSeconds(5))}
              />
            </CustomDropdownMenu>

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                minWidth: '168px',
                maxWidth: '168px',
                alignItems: 'center',
              }}
            >
              <MinusButton onClick={() => decrimentCreditHoursDuration()} />
              <TextField
                id="standard-basic"
                variant="standard"
                sx={{
                  '.MuiInputBase-root::after, .MuiInputBase-root::before': { content: 'none' },
                  '.MuiInputBase-root': {
                    color:
                      convertDurationInSecondsToString(localCreditHoursDurationInSeconds) != '00:00'
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
                value={convertDurationInSecondsToString(localCreditHoursDurationInSeconds)}
                onChange={(event) => {
                  setLocalCreditHoursDurationInSeconds(convertDurationStringToSeconds(event.target.value));
                }}
              />
              <PlusButton onClick={() => incrementCreditHoursDuration()} />
            </Box>
          </StyledBox>
        ) : null}
      </StyledRowContainer>
      <StyledRowContainer ref={styledRowContainerWithBibleStudiesRef} sx={{ alignItems: 'center' }}>
        <CustomDropdownContainer
          open={dropdownWithStudiesOpen}
          reference={dropdownWithStudiesOpenButtonReference}
          label={t('tr_bibleStudies')}
          onClick={() => setDropdownWithStudiesOpen((prev) => !prev)}
        />
        <CustomDropdownMenu
          open={dropdownWithStudiesOpen}
          reference={dropdownWithStudiesReference}
          zIndex={(theme) => theme.zIndex.drawer + 3}
          anchorElement={styledRowContainerWithBibleStudiesRef.current}
          width={styledRowContainerWithBibleStudiesRef.current?.offsetWidth + 'px'}
        >
          {props.bibleStudiesList.map((value, index) => {
            const randomKey = crypto.randomUUID();

            return (
              <CustomDropdownItem
                variant="studies"
                checked={checkedLocalStudiesStatesList[index]}
                label={value}
                editButtonClick={() => {
                  setDropdownWithStudiesOpen(false);
                  setEditAndAddBibleStudyData({
                    itemValue: value,
                    itemIndex: index,
                    popUpWindowOpen: true,
                    variant: 'edit',
                  });
                }}
                key={randomKey}
                callback={() =>
                  setCheckedLocalStudiesStatesList((prev) => {
                    const updatedArray = [...prev];
                    updatedArray[index] = !updatedArray[index];
                    return updatedArray;
                  })
                }
              />
            );
          })}
          <CustomDropdownItem
            variant="custom"
            sx={{
              '.MuiSvgIcon-root path': {
                fill: 'var(--accent-dark)',
              },
              borderBottom: 'none',
            }}
            callback={() => {
              setDropdownWithStudiesOpen(false);
              setEditAndAddBibleStudyData({ ...editAndAddBibleStudyData, variant: 'add', popUpWindowOpen: true });
            }}
          >
            <IconAdd />
            <CustomTypography className="h4" color="var(--accent-dark)">
              {t('tr_addNewStudy')}
            </CustomTypography>
          </CustomDropdownItem>
        </CustomDropdownMenu>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            minWidth: '168px',
            maxWidth: '168px',
            alignItems: 'center',
          }}
        >
          <MinusButton onClick={decrimentCountOfStudies} />
          <CustomTypography className="h2" color={countOfStudies != 0 ? 'var(--black)' : 'var(--grey-300)'}>
            {countOfStudies}
          </CustomTypography>
          <PlusButton onClick={incrementCountOfStudies} />
        </Box>
      </StyledRowContainer>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <CustomButton variant="secondary" onClick={props.cancelButtonClick}>
          {t('tr_cancel')}
        </CustomButton>
        <CustomButton
          variant="main"
          onClick={() => {
            props.result({
              hoursInSeconds: localDurationInSeconds,
              creditHoursInSeconds: localCreditHoursDurationInSeconds,
              bibleStudiesCount: countOfStudies,
              bibleStudies: getArrayWithCheckedStudies(),
              date: localDate,
            });
            props.addButtonClick();
          }}
        >
          {t('tr_add')}
        </CustomButton>
      </Box>
    </StyledModalWindowContainer>
  );
};

export default AddServiceTimeModalWindow;
