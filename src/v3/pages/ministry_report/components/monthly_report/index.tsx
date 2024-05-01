import CustomCheckbox from '@components/checkbox';
import ScrollableTabs from '@components/scrollable_tabs';
import CustomTextarea from '@components/textarea';
import CustomTypography from '@components/typography';
import useAppTranslation from '@hooks/useAppTranslation';
import { Box } from '@mui/material';
import { ReactElement, useContext, useEffect, useRef, useState } from 'react';
import { MonthlyReportProps } from './monthly_report.types';
import { CustomDropdownContainer, CustomDropdownItem, CustomDropdownMenu } from '@components/dropdown';
import CustomInfoMessage from '@components/info-message';
import { IconAdd, IconCheck, IconClose, IconError } from '@components/icons';
import { MiniChip, MinusButton, PlusButton } from '@components/index';
import { EditAndAddBibleStudyContext } from '@features/ministry/EditAndAddBibleStudyContext';

const MonthlyReport = (props: MonthlyReportProps) => {
  const { t } = useAppTranslation();

  const variant = props.variant || 'empty';

  const { editAndAddBibleStudyData, setEditAndAddBibleStudyData } = useContext(EditAndAddBibleStudyContext);

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

  const [countOfStudies, setCountOfStudies] = useState(0);
  const [countOfStudiesInBuffer, setCountOfStudiesInBuffer] = useState(0);

  const incrementCountOfStudiesInBuffer = () => {
    setCountOfStudiesInBuffer(countOfStudiesInBuffer + 1);
  };

  const [infoMessageBoxOpen, setInfoMessageBoxOpen] = useState(false);

  const decrimentCountOfStudiesInBuffer = () => {
    if (countOfStudiesInBuffer != 0) {
      setCountOfStudiesInBuffer(countOfStudiesInBuffer - 1);
    } else {
      setInfoMessageBoxOpen(true);
    }
  };

  const [dropdownWithStudiesOpen, setDropdownWithStudiesOpen] = useState(false);

  const dropdownWithStudiesReference = useRef(null);
  const dropdownWithStudiesOpenButtonReference = useRef(null);

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
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownWithStudiesOpen]);

  useEffect(() => {
    let studiesCounter = 0;
    props.bibleStudiesList.forEach((value, index) => {
      if (checkedLocalStudiesStatesList[index]) {
        studiesCounter++;
      }
    });

    setCountOfStudies(studiesCounter + countOfStudiesInBuffer);
  }, [checkedLocalStudiesStatesList, countOfStudiesInBuffer, props.bibleStudiesList]);

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
      <ScrollableTabs tabs={months} />
      <CustomCheckbox
        label={t('tr_sharedMinistry')}
        checked={sharedMinistry}
        onChange={() => setSharedMinistry((prev) => !prev)}
      />
      {variant != 'empty' ? (
        <>
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <CustomDropdownContainer
              open={dropdownWithStudiesOpen}
              reference={dropdownWithStudiesOpenButtonReference}
              label={t('tr_bibleStudies')}
              onClick={() => setDropdownWithStudiesOpen((prev) => !prev)}
            />
            <CustomDropdownMenu
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
                    editButtonClick={() => {
                      setDropdownWithStudiesOpen(false);
                      setEditAndAddBibleStudyData({
                        darkOverlayOpen: true,
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
                    darkOverlayOpen: true,
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
              <CustomTypography className="h3" color={countOfStudies != 0 ? 'var(--black)' : 'var(--grey-300)'}>
                {countOfStudies}
              </CustomTypography>
              <PlusButton onClick={incrementCountOfStudiesInBuffer} />
            </Box>
          </Box>
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
      <CustomTextarea placeholder={t('tr_comments')} />
    </Box>
  );
};

export default MonthlyReport;
