import { Box, Theme } from '@mui/material';

import {
  StyledBox,
  StyledModalWindowContainer,
  StyledRowContainer,
} from './add_service_time_modal_window.styled';
import { AddServiceTimeModalWindowProps } from './add_service_time_modal_window.types';
import useAppTranslation from '@hooks/useAppTranslation';

import CustomTypography from '@components/typography';
import MinusButton from '@components/minus_button';
import PlusButton from '@components/plus_button';

import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import {
  CustomDropdownContainer,
  CustomDropdownItem,
  CustomDropdownMenu,
} from '@components/dropdown';
import {
  IconAdd,
  IconError,
  IconLanguageCourse,
  IconPersonalDay,
  IconSchool,
  IconSchoolForEvangelizers,
} from '@components/icons';
import { hoursToSeconds } from 'date-fns';
import CustomButton from '@components/button';
import CustomDatePicker from '@components/date_picker';
import CustomInfoMessage from '@components/info-message';
import MiniChip from '@components/mini_chip';
import { MinistryRecord } from '@pages/ministry/ministry_report/ministry_report.types';
import CustomTimeTextField from '@components/time_textfield';
import { EditAndAddBibleStudyContext } from './EditAndAddBibleStudyContext';
import {
  convertDurationInSecondsToString,
  convertDurationStringToSeconds,
} from './utils';

/**
 * Add Service Time Modal Window component.
 */
export const AddServiceTimeModalWindow = (
  props: AddServiceTimeModalWindowProps
) => {
  const variant = props.variant || 'simple';
  const showCreditHours = props.showCreditHours || false;

  const mode = props.mode || 'add';

  if (mode == 'edit' && props.recordForEdit == undefined) {
    throw new Error('Record for edit not setted!');
  }

  const { editAndAddBibleStudyData, setEditAndAddBibleStudyData } = useContext(
    EditAndAddBibleStudyContext
  );

  const { t } = useAppTranslation();

  const [localDurationInSeconds, setLocalDurationInSeconds] = useState(0);

  const [
    localCreditHoursDurationInSeconds,
    setLocalCreditHoursDurationInSeconds,
  ] = useState(0);
  const [dropdownWithStudiesOpen, setDropdownWithStudiesOpen] = useState(false);
  const [dropdownWithSchoolsOpen, setDropdownWithSchoolsOpen] = useState(false);

  const dropdownWithStudiesReference = useRef(null);
  const dropdownWithSchoolsReference = useRef(null);
  const dropdownWithStudiesOpenButtonReference = useRef(null);
  const dropdownWithSchoolsOpenButtonReference = useRef(null);

  const styledRowContainerWithBibleStudiesRef = useRef(null);
  const styledRowContainerWithCreditHours = useRef(null);

  const [countOfStudies, setCountOfStudies] = useState(0);
  const [countOfStudiesInBuffer, setCountOfStudiesInBuffer] = useState(0);
  const [infoMessageBoxOpen, setInfoMessageBoxOpen] = useState(false);

  const decrimentDuration = () => {
    if (convertDurationInSecondsToString(localDurationInSeconds) != '00:00') {
      setLocalDurationInSeconds((prev) => prev - 3600);
    }
  };

  const incrementDuration = () => {
    setLocalDurationInSeconds((prev) => prev + 3600);
  };

  const incrementCreditHoursDuration = () => {
    setLocalCreditHoursDurationInSeconds(
      localCreditHoursDurationInSeconds + 3600
    );
  };

  const decrimentCreditHoursDuration = () => {
    if (
      convertDurationInSecondsToString(localCreditHoursDurationInSeconds) !=
      '00:00'
    ) {
      setLocalCreditHoursDurationInSeconds(
        localCreditHoursDurationInSeconds - 3600
      );
    }
  };

  const closeInfoMessageAfterDelay = () => {
    setTimeout(() => {
      setInfoMessageBoxOpen(false);
    }, 5000);
  };

  useEffect(() => {
    if (mode == 'edit') {
      setCountOfStudiesInBuffer(
        props.recordForEdit.count_of_bible_studies -
          props.recordForEdit.bible_studies.length
      );
    }
  }, [
    mode,
    props.recordForEdit.bible_studies?.length,
    props.recordForEdit.count_of_bible_studies,
  ]);

  const incrementCountOfStudiesInBuffer = () => {
    setCountOfStudiesInBuffer(countOfStudiesInBuffer + 1);
  };

  const decrimentCountOfStudiesInBuffer = () => {
    if (countOfStudiesInBuffer != 0) {
      setCountOfStudiesInBuffer(countOfStudiesInBuffer - 1);
    } else {
      setInfoMessageBoxOpen(true);
      closeInfoMessageAfterDelay();
    }
  };

  const getArrayWithStudiesStates = useCallback((): boolean[] => {
    const tmpArray = [];

    for (let i = 0; i < props.bibleStudiesList.length; i++) {
      let found = false;
      for (let j = 0; j < props.recordForEdit.bible_studies.length; j++) {
        if (
          props.bibleStudiesList[i] === props.recordForEdit.bible_studies[j]
        ) {
          found = true;
          break;
        }
      }
      tmpArray.push(found);
    }

    return tmpArray;
  }, [props.bibleStudiesList, props.recordForEdit.bible_studies]);

  const [checkedLocalStudiesStatesList, setCheckedLocalStudiesStatesList] =
    useState(() => {
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

  const [localDate, setLocalDate] = useState<Date>(new Date());

  const clearAllFields = () => {
    setLocalDurationInSeconds(0);
    setCheckedLocalStudiesStatesList(
      Array<boolean>(props.bibleStudiesList.length).fill(false)
    );
    setLocalCreditHoursDurationInSeconds(0);
    setCountOfStudiesInBuffer(0);
  };

  const styleForStyledBox = (theme: Theme) => ({
    [theme.breakpoints.down('tablet')]: {
      flexDirection: 'column',
      '& .MuiBox-root': {
        width: '100%',
        maxWidth: 'none',
        minWidth: 'none',
      },
    },
  });

  useEffect(() => {
    setLocalDurationInSeconds(
      mode == 'add' ? props.duration : props.recordForEdit.hours_in_seconds
    );
  }, [mode, props.duration, props.recordForEdit.hours_in_seconds]);

  useEffect(() => {
    if (mode == 'edit') {
      setLocalCreditHoursDurationInSeconds(
        props.recordForEdit.credit_hours_in_seconds
      );
    }
  }, [
    mode,
    props.recordForEdit.credit_hours_in_seconds,
    localCreditHoursDurationInSeconds,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownWithStudiesOpenButtonReference.current &&
        !dropdownWithStudiesOpenButtonReference.current.contains(
          event.target
        ) &&
        dropdownWithStudiesOpen &&
        dropdownWithStudiesReference.current &&
        !dropdownWithStudiesReference.current.contains(event.target)
      ) {
        setDropdownWithStudiesOpen(false);
      }

      if (
        dropdownWithSchoolsOpenButtonReference.current &&
        !dropdownWithSchoolsOpenButtonReference.current.contains(
          event.target
        ) &&
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

  useEffect(() => {
    if (mode == 'edit') {
      setCountOfStudiesInBuffer(
        props.recordForEdit.count_of_bible_studies -
          props.recordForEdit.bible_studies.length
      );
    }
  }, [
    mode,
    props.recordForEdit.bible_studies?.length,
    props.recordForEdit.count_of_bible_studies,
  ]);

  useEffect(() => {
    if (mode == 'edit') {
      setCheckedLocalStudiesStatesList(getArrayWithStudiesStates);
    }
  }, [getArrayWithStudiesStates, mode]);

  // code for fix bug with empty field
  useEffect(() => {
    if (
      convertDurationInSecondsToString(localDurationInSeconds) === 'NaN:NaN'
    ) {
      setLocalDurationInSeconds(0);
    }

    if (
      convertDurationInSecondsToString(localCreditHoursDurationInSeconds) ===
      'NaN:NaN'
    ) {
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

    setCountOfStudies(studiesCounter + countOfStudiesInBuffer);
  }, [
    checkedLocalStudiesStatesList,
    countOfStudiesInBuffer,
    props.bibleStudiesList,
  ]);

  return (
    <>
      <StyledModalWindowContainer
        ref={props.reference}
        className="pop-up-shadow"
        sx={(theme) => ({
          marginLeft: { mobile: '16px', tablet: '24px', desktop: '32px' },
          marginRight: { mobile: '16px', tablet: '24px', desktop: '32px' },
          marginTop: '16px',
          marginBottom: '16px',

          [theme.breakpoints.up(540)]: {
            width: '100%',
          },
        })}
      >
        <Box>
          <CustomTypography className="h2">
            {mode == 'add' ? t('tr_addServiceTime') : t('tr_editServiceTime')}
          </CustomTypography>
          <Box
            sx={{
              marginTop: '8px',
              '.MuiButtonBase-root': { padding: 0 },
              '.MuiButtonBase-root:hover': { backgroundColor: 'transparent' },
            }}
          >
            <CustomDatePicker
              view={'button'}
              onChange={async (value) => setLocalDate(value)}
              value={new Date()}
            />
          </Box>
        </Box>
        <StyledRowContainer
          sx={{
            justifyContent: 'space-between',
            flexDirection: 'column',
            alignItems: 'stretch',
          }}
          ref={styledRowContainerWithCreditHours}
        >
          <StyledBox sx={styleForStyledBox}>
            <CustomTypography className="body-regular">
              {t('tr_hours')}
            </CustomTypography>
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
              <CustomTimeTextField
                value={convertDurationInSecondsToString(localDurationInSeconds)}
                onChange={(event) => {
                  setLocalDurationInSeconds(
                    convertDurationStringToSeconds(event.target.value)
                  );
                }}
                color={
                  convertDurationInSecondsToString(localDurationInSeconds) !=
                  '00:00'
                    ? 'var(--black)'
                    : 'var(--grey-300)'
                }
              />
              <PlusButton onClick={incrementDuration} />
            </Box>
          </StyledBox>
          {variant == 'pioneer' && showCreditHours ? (
            <StyledBox sx={styleForStyledBox}>
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
                width={
                  styledRowContainerWithCreditHours.current?.offsetWidth + 'px'
                }
                zIndex={(theme) => theme.zIndex.drawer + 3}
              >
                <CustomDropdownItem
                  variant="schools"
                  label={t('tr_pioneerSchool')}
                  description={t('tr_ministryTimeHours', { ministryTime: 30 })}
                  icon={<IconSchool />}
                  checked={false}
                  callback={() =>
                    setLocalCreditHoursDurationInSeconds(hoursToSeconds(30))
                  }
                />
                <CustomDropdownItem
                  variant="schools"
                  label={t('tr_SKE')}
                  description={t('tr_ministryTimeHours', { ministryTime: 80 })}
                  icon={<IconSchoolForEvangelizers />}
                  checked={false}
                  callback={() =>
                    setLocalCreditHoursDurationInSeconds(hoursToSeconds(80))
                  }
                />
                <CustomDropdownItem
                  variant="schools"
                  label={t('tr_languageCourse')}
                  description={t('tr_ministryTimeHours', { ministryTime: 25 })}
                  icon={<IconLanguageCourse />}
                  checked={false}
                  callback={() =>
                    setLocalCreditHoursDurationInSeconds(hoursToSeconds(25))
                  }
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
                  callback={() =>
                    setLocalCreditHoursDurationInSeconds(hoursToSeconds(5))
                  }
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
                <CustomTimeTextField
                  value={convertDurationInSecondsToString(
                    localCreditHoursDurationInSeconds
                  )}
                  onChange={(event) => {
                    setLocalCreditHoursDurationInSeconds(
                      convertDurationStringToSeconds(event.target.value)
                    );
                  }}
                  color={
                    convertDurationInSecondsToString(
                      localCreditHoursDurationInSeconds
                    ) != '00:00'
                      ? 'var(--black)'
                      : 'var(--grey-300)'
                  }
                />
                <PlusButton onClick={() => incrementCreditHoursDuration()} />
              </Box>
            </StyledBox>
          ) : null}
        </StyledRowContainer>
        <StyledRowContainer
          ref={styledRowContainerWithBibleStudiesRef}
          sx={{
            flexDirection: 'column',
          }}
        >
          <StyledBox
            sx={(theme) => ({
              gap: '16px',
              [theme.breakpoints.down('tablet')]: {
                justifyContent: 'center',
                flexDirection: 'column',
                '& .MuiBox-root': {
                  width: '100%',
                  maxWidth: 'none',
                  minWidth: 'none',
                },
              },
            })}
          >
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
              width={
                styledRowContainerWithBibleStudiesRef.current?.offsetWidth +
                'px'
              }
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
                  setEditAndAddBibleStudyData({
                    ...editAndAddBibleStudyData,
                    variant: 'add',
                    popUpWindowOpen: true,
                  });
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
              <MinusButton onClick={decrimentCountOfStudiesInBuffer} />
              <CustomTypography
                className="h3"
                color={countOfStudies != 0 ? 'var(--black)' : 'var(--grey-300)'}
              >
                {countOfStudies}
              </CustomTypography>
              <PlusButton onClick={incrementCountOfStudiesInBuffer} />
            </Box>
          </StyledBox>
          {getArrayWithCheckedStudies().length != 0 ? (
            <Box
              sx={{
                display: 'flex',
                gap: '4px',
                flexWrap: 'wrap',
              }}
            >
              {getArrayWithCheckedStudies().map((value) => {
                const randomKey = crypto.randomUUID();

                return (
                  <MiniChip
                    label={value}
                    key={randomKey}
                    edit={true}
                    onDelete={() => {
                      props.bibleStudiesList.forEach((globalValue, index) => {
                        if (value == globalValue) {
                          setCheckedLocalStudiesStatesList((prev) => {
                            const tmpArray = [...prev];
                            tmpArray[index] = false;

                            return tmpArray;
                          });
                        }
                      });
                    }}
                  />
                );
              })}
            </Box>
          ) : null}
        </StyledRowContainer>
        <Box
          sx={(theme) => ({
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            [theme.breakpoints.down('tablet')]: {
              flexDirection: 'column',
              gap: '8px',
            },
          })}
        >
          <CustomButton variant="secondary" onClick={props.cancelButtonClick}>
            {t('tr_cancel')}
          </CustomButton>
          <CustomButton
            variant="main"
            onClick={() => {
              props.result(
                new MinistryRecord(
                  new Date().toString(),
                  countOfStudies,
                  localDurationInSeconds,
                  localCreditHoursDurationInSeconds,
                  getArrayWithCheckedStudies()
                )
              );
              props.addButtonClick();

              // Clear all values
              clearAllFields();
            }}
          >
            {mode == 'add' ? t('tr_add') : t('tr_save')}
          </CustomButton>
        </Box>
      </StyledModalWindowContainer>
      <CustomInfoMessage
        variant="error"
        sx={{
          position: 'fixed',
          bottom: '24px',
          visibility: infoMessageBoxOpen ? 'visible' : 'hidden',
        }}
        messageHeader={t('tr_cantDeductStudiesTitle')}
        message={t('tr_cantDeductStudiesDesc')}
        messageIcon={<IconError />}
        onClose={() => {
          setInfoMessageBoxOpen(false);
        }}
      />
    </>
  );
};

export default AddServiceTimeModalWindow;
