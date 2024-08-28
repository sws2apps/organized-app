import CustomCheckbox from '@components/checkbox';
import ScrollableTabs from '@components/scrollable_tabs';
import CustomTypography from '@components/typography';
import useAppTranslation from '@hooks/useAppTranslation';
import { Box } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { MonthlyReportProps } from './monthly_report.types';
// import { CustomDropdownContainer, CustomDropdownItem, CustomDropdownMenu } from '@components/dropdown';
import CustomInfoMessage from '@components/info-message';
import {
  // IconAdd,
  IconError,
  // IconLanguageCourse,
  // IconPersonalDay,
  // IconSchool,
  // IconSchoolForEvangelizers,
} from '@components/icons';
import { CustomDivider, MiniChip } from '@components/index';
// import { EditAndAddBibleStudyContext } from '@features/ministry/EditAndAddBibleStudyContext';
import CustomBadge from '@components/badge';
import { convertDurationInSecondsToString } from '@features/ministry/add_service_time_modal_window/utils';
import { getMonthIndexFromDate } from '@pages/ministry/ministry_report/old/utils';
// import { hoursToSeconds } from 'date-fns';

/**
 * MonthlyReport component displays a monthly report for ministry activities.
 * It includes various sections such as tabs for selecting months, options for shared ministry, credit hours, and comments.
 * This component is customizable based on the MonthlyReportProps provided.
 * @param props MonthlyReportProps containing the configuration and data for the component.
 */
const MonthlyReport = (props: MonthlyReportProps) => {
  const { t } = useAppTranslation();

  const variant = props.variant || 'empty';

  const showCreditHours = props.showCreditHours || false;

  // TODO: If you want add Minus and Plus button,
  // uncomment all comments in this file, where you see code.

  // const { editAndAddBibleStudyData, setEditAndAddBibleStudyData } = useContext(EditAndAddBibleStudyContext);

  const months = props.months || [
    {
      label: t('tr_january'),
      Component: <></>,
    },
    {
      label: t('tr_february'),
      Component: <></>,
    },
    {
      label: t('tr_march'),
      Component: <></>,
    },
    {
      label: t('tr_april'),
      Component: <></>,
    },
    {
      label: t('tr_may'),
      Component: <></>,
    },
    {
      label: t('tr_june'),
      Component: <></>,
    },
    {
      label: t('tr_july'),
      Component: <></>,
    },
    {
      label: t('tr_august'),
      Component: <></>,
    },
    {
      label: t('tr_september'),
      Component: <></>,
    },
    {
      label: t('tr_october'),
      Component: <></>,
    },
    {
      label: t('tr_november'),
      Component: <></>,
    },
    {
      label: t('tr_december'),
      Component: <></>,
    },
  ];

  const [sharedMinistry, setSharedMinistry] = useState(false);

  const [totalOutOf_Hours, setTotalOutOf_Hours] = useState(0);

  const [countOfStudies, setCountOfStudies] = useState(
    props.record.count_of_bible_studies
  );
  const [studiesList, setStudiesList] = useState(props.record.bible_studies);

  // const [countOfStudiesInBuffer, setCountOfStudiesInBuffer] = useState(0);

  // const incrementCountOfStudiesInBuffer = () => {
  //   setCountOfStudiesInBuffer((prev) => prev + 1);
  // };

  const [infoMessageBoxOpen, setInfoMessageBoxOpen] = useState(false);

  // const decrimentCountOfStudiesInBuffer = () => {
  //   if (countOfStudiesInBuffer != 0) {
  //     setCountOfStudiesInBuffer((prev) => prev - 1);
  //   } else {
  //     setInfoMessageBoxOpen(true);
  //   }
  // };

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

  const [
    localCreditHoursDurationInSeconds,
    setLocalCreditHoursDurationInSeconds,
  ] = useState(0);

  // const incrementCreditHoursDuration = () => {
  //   setLocalCreditHoursDurationInSeconds((prev) => prev + 3600);
  // };
  // const decrimentCreditHoursDuration = () => {
  //   if (convertDurationInSecondsToString(localCreditHoursDurationInSeconds) != '00:00') {
  //     setLocalCreditHoursDurationInSeconds((prev) => prev - 3600);
  //   }
  // };

  const [localDurationInSeconds, setLocalDurationInSeconds] = useState(
    props.record.hours_in_seconds
  );

  // const incrementLocalDurationInSeconds = () => {
  //   setLocalDurationInSeconds((prev) => prev + 3600);
  // };

  // const decrimentLocalDurationInSeconds = () => {
  //   if (localDurationInSeconds != 0) {
  //     setLocalDurationInSeconds((prev) => prev - 3600);
  //   }
  // };

  useEffect(() => {
    if (localDurationInSeconds > 50 * 3600) {
      setTotalOutOf_Hours(50);

      if (localDurationInSeconds > 100 * 3600) {
        setTotalOutOf_Hours(100);
      }
    }
  }, [localDurationInSeconds]);

  // useEffect(() => {
  //   // Call the onChange function with the updated MinistryRecord data
  //   props.onChange({
  //     date_of_creation: '',
  //     count_of_bible_studies: countOfStudies,
  //     hours_in_seconds: localDurationInSeconds,
  //     credit_hours_in_seconds: localCreditHoursDurationInSeconds,
  //     bible_studies: getArrayWithCheckedStudies(),
  //   });
  // }, [countOfStudies, getArrayWithCheckedStudies, localCreditHoursDurationInSeconds, localDurationInSeconds, props]);

  return (
    <Box
      sx={{
        border: '1px solid var(--accent-300)',
        borderRadius: 'var(--radius-xl)',
        backgroundColor: 'var(--white)',
        display: 'flex',
        padding: '16px',
        gap: '16px',
        flexDirection: 'column',
      }}
    >
      <CustomTypography className="h2" id="AQdwN">
        {t('tr_monthlyReport')}
      </CustomTypography>
      <ScrollableTabs
        tabs={months}
        indicatorMode
        value={getMonthIndexFromDate(new Date().toString())}
      />
      {variant == 'pioneer' || variant == 'special-pioneer' ? null : (
        <CustomCheckbox
          label={t('tr_sharedMinistry')}
          checked={sharedMinistry}
          onChange={() => setSharedMinistry((prev) => !prev)}
        />
      )}
      {variant == 'pioneer' || variant == 'special-pioneer' ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <CustomDivider color="var(--accent-200)" height={1} />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                justifyContent: 'center',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: '8px',
                }}
              >
                <CustomTypography className="body-regular">
                  {t('tr_total')}
                </CustomTypography>
                {totalOutOf_Hours != 0 ? (
                  <CustomBadge
                    size={'medium'}
                    text={t('tr_badgeGoalHours', {
                      ministryTime: totalOutOf_Hours,
                    })}
                    color={'accent'}
                  />
                ) : null}
              </Box>
              <CustomTypography
                className="body-small-regular"
                color="var(--grey-350)"
              >
                {t('tr_includesServiceAndCredit')}
              </CustomTypography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                // minWidth: '168px',
                // maxWidth: '168px',
                alignItems: 'center',
              }}
            >
              {/* <MinusButton onClick={decrimentLocalDurationInSeconds} /> */}
              {/* <TextField
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
                    lineHeight: '24px',
                  },
                }}
                value={convertDurationInSecondsToString(localDurationInSeconds)}
                onChange={(event) => {
                  setLocalDurationInSeconds(convertDurationStringToSeconds(event.target.value));
                }}
              /> */}
              <CustomTypography
                className="h3"
                sx={{
                  color:
                    convertDurationInSecondsToString(localDurationInSeconds) !=
                    '00:00'
                      ? 'var(--black)'
                      : 'var(--grey-300)',
                }}
              >
                {convertDurationInSecondsToString(localDurationInSeconds)}
              </CustomTypography>
              {/* <PlusButton onClick={incrementLocalDurationInSeconds} /> */}
            </Box>
          </Box>

          {/** For change border use this website (border generator): https://codepen.io/amit_sheen/pen/xxZeyjO */}
          {showCreditHours ? (
            <CustomDivider
              color="transparent"
              sx={{
                backgroundImage: `repeating-linear-gradient(0deg, var(--accent-200), var(--accent-200) 5px, transparent 5px, transparent 10px, var(--accent-200) 10px), repeating-linear-gradient(90deg, var(--accent-200), var(--accent-200) 5px, transparent 5px, transparent 10px, var(--accent-200) 10px), repeating-linear-gradient(180deg, var(--accent-200), var(--accent-200) 5px, transparent 5px, transparent 10px, var(--accent-200) 10px), repeating-linear-gradient(270deg, var(--accent-200), var(--accent-200) 5px, transparent 5px, transparent 10px, var(--accent-200) 10px)`,
                backgroundSize: `1px 100%, 100% 1px, 1px 100% , 100% 1px`,
                backgroundPosition: `0 0, 0 0, 100% 0, 0 100%`,
                backgroundRepeat: `no-repeat`,
                borderColor: 'transparent',
              }}
            />
          ) : (
            <CustomDivider color="var(--accent-200)" height={1} />
          )}

          {showCreditHours ? (
            <>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    justifyContent: 'center',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      gap: '8px',
                    }}
                  >
                    {/* <CustomDropdownContainer
                      open={dropdownWithSchoolsOpen}
                      label={t('tr_creditHours')}
                      onClick={() => setDropdownWithSchoolsOpen((prev) => !prev)}
                      reference={dropdownWithSchoolsOpenButtonReference}
                    /> */}

                    <CustomTypography className="body-regular">
                      {t('tr_creditHours')}
                    </CustomTypography>

                    {/* <CustomDropdownMenu
                      reference={dropdownWithSchoolsReference}
                      open={dropdownWithSchoolsOpen}
                      anchorElement={dropdownWithSchoolsOpenButtonReference.current}
                      width={document.getElementById('AQdwN')?.offsetWidth + 'px'}
                      zIndex={(theme) => theme.zIndex.drawer + 3}
                      placement="bottom-start"
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
                    </CustomDropdownMenu> */}
                    {totalOutOf_Hours != 0 ? (
                      <CustomBadge
                        size={'medium'}
                        text={t('tr_badgeGoalHours', {
                          ministryTime: totalOutOf_Hours,
                        })}
                        color={'accent'}
                      />
                    ) : null}
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    // minWidth: '168px',
                    // maxWidth: '168px',
                    alignItems: 'center',
                  }}
                >
                  {/* <MinusButton onClick={decrimentCreditHoursDuration} /> */}
                  {/* <TextField
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
                        lineHeight: '24px',
                      },
                    }}
                    value={convertDurationInSecondsToString(localCreditHoursDurationInSeconds)}
                    onChange={(event) => {
                      setLocalCreditHoursDurationInSeconds(convertDurationStringToSeconds(event.target.value));
                    }}
                  /> */}
                  <CustomTypography
                    className="h3"
                    sx={{
                      color:
                        convertDurationInSecondsToString(
                          localCreditHoursDurationInSeconds
                        ) != '00:00'
                          ? 'var(--black)'
                          : 'var(--grey-300)',
                    }}
                  >
                    {convertDurationInSecondsToString(
                      localCreditHoursDurationInSeconds
                    )}
                  </CustomTypography>
                  {/* <PlusButton onClick={incrementCreditHoursDuration} /> */}
                </Box>
              </Box>

              <CustomDivider color="var(--accent-200)" height={1} />
            </>
          ) : null}
        </Box>
      ) : null}
      {variant != 'empty' && sharedMinistry ? (
        <>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* <CustomDropdownContainer
              open={dropdownWithStudiesOpen}
              reference={dropdownWithStudiesOpenButtonReference}
              label={t('tr_bibleStudies')}
              onClick={() => setDropdownWithStudiesOpen((prev) => !prev)}
            /> */}

            <CustomTypography className="body-regular">
              {t('tr_bibleStudies')}
            </CustomTypography>

            {/* <CustomDropdownMenu
              open={dropdownWithStudiesOpen}
              placement="bottom-start"
              reference={dropdownWithStudiesReference}
              zIndex={(theme) => theme.zIndex.drawer + 3}
              anchorElement={dropdownWithStudiesOpenButtonReference.current}
              width={document.getElementById('AQdwN')?.offsetWidth + 'px'}
            >
              {props.bibleStudiesList.map((value, index) => {
                const randomKey = crypto.randomUUID();
                return (
                  <CustomDropdownItem
                    variant="studies"
                    checked={checkedLocalStudiesStatesList[index]}
                    label={value}
                    // editButtonClick={() => {
                    //   setDropdownWithStudiesOpen(false);
                    //   setEditAndAddBibleStudyData({
                    //     darkOverlayOpen: true,
                    //     itemValue: value,
                    //     itemIndex: index,
                    //     popUpWindowOpen: true,
                    //     variant: 'edit',
                    //   });
                    // }}
                    key={randomKey}
                    // callback={() =>
                    //   setCheckedLocalStudiesStatesList((prev) => {
                    //     const updatedArray = [...prev];
                    //     updatedArray[index] = !updatedArray[index];
                    //     return updatedArray;
                    //   })
                    // }
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
                    darkOverlayOpen: true,
                  });
                }}
              >
                <IconAdd />
                <CustomTypography className="h4" color="var(--accent-dark)">
                  {t('tr_addNewStudy')}
                </CustomTypography>
              </CustomDropdownItem>
            </CustomDropdownMenu> */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                // minWidth: '168px',
                // maxWidth: '168px',
                alignItems: 'center',
              }}
            >
              {/* <MinusButton onClick={decrimentCountOfStudiesInBuffer} /> */}
              <CustomTypography
                className="h3"
                color={countOfStudies != 0 ? 'var(--black)' : 'var(--grey-300)'}
              >
                {countOfStudies}
              </CustomTypography>
              {/* <PlusButton onClick={incrementCountOfStudiesInBuffer} /> */}
            </Box>
          </Box>
          {studiesList.length != 0 ? (
            <Box
              sx={{
                display: 'flex',
                gap: '4px',
                flexWrap: 'wrap',
              }}
            >
              {studiesList.map((value) => {
                const randomKey = crypto.randomUUID();

                return (
                  <MiniChip
                    label={value}
                    key={randomKey}
                    edit={false}
                    // onDelete={() => {
                    //   props.bibleStudiesList.forEach((globalValue, index) => {
                    //     if (value == globalValue) {
                    //       setCheckedLocalStudiesStatesList((prev) => {
                    //         const tmpArray = [...prev];
                    //         tmpArray[index] = false;

                    //         return tmpArray;
                    //       });
                    //     }
                    //   });
                    // }}
                  />
                );
              })}
            </Box>
          ) : null}
        </>
      ) : null}
      <CustomInfoMessage
        variant="error"
        sx={{
          visibility: infoMessageBoxOpen ? 'visible' : 'hidden',
          display: infoMessageBoxOpen ? 'flex' : 'none',
          width: '100%',
          maxWidth: '100%',
        }}
        messageHeader={t('tr_cantDeductStudiesTitle')}
        message={t('tr_cantDeductStudiesDesc')}
        messageIcon={<IconError />}
        onClose={() => {
          setInfoMessageBoxOpen(false);
        }}
      />
    </Box>
  );
};

export default MonthlyReport;
