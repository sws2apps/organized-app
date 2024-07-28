import { IconSend, IconUndo } from '@components/icons';
import PageTitle from '@components/page_title';
import useAppTranslation from '@hooks/useAppTranslation';
import useBreakpoints from '@hooks/useBreakpoints';
import { Box } from '@mui/material';
import MonthlyReport from './components/monthly_report';
import CustomButton from '@components/button';
import {
  MinistryRecord,
  MinistryRecordActionMode,
  MinistryReportVariants,
} from './ministry_report.types';
import { useMemo, useRef, useState } from 'react';
import DarkOverlay from '@components/dark_overlay';
// import { getTmpMinistryRecords } from './_tmpMinistryRecords';
import DailyHistory from './components/daily_history';
import { convertDurationStringToSeconds } from '@features/ministry/add_service_time_modal_window/utils';
import { secondsToHours, secondsToMinutes } from 'date-fns';
import TransferMinutesPopUp from './components/transfer_minutes_popup';
import { TransferMinutesVariant } from './components/transfer_minutes_popup/transfer_minutes_popup.types';
import { EditAndAddBibleStudyContext } from '@features/ministry/add_service_time_modal_window/EditAndAddBibleStudyContext';
import { AddServiceTimeModalWindow } from '@features/ministry/add_service_time_modal_window';
import PopUpForEditOrCreateBibleStudy from '@features/ministry/pop_up_for_edit_or_create_bible_study';

const MinistryReport = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const handleTheConfirmReport = () => {
    const totalRecord = getTotalRecordByDailyHistory();

    const hoursInSeconds = secondsToHours(totalRecord.hours_in_seconds) * 3600;
    const floorMinutes = secondsToMinutes(
      totalRecord.hours_in_seconds - hoursInSeconds
    );

    if (floorMinutes > 0) {
      setExtraMinutes(floorMinutes);
      setTransferMinutesPopUpOpen(true);
    } else {
      confirmReport();
    }
  };

  const [comment, setComment] = useState(['']);

  // TODO: Connect API | Add next stages (Out)
  const confirmReport = () => {
    const totalRecord = getTotalRecordByDailyHistory();
    const reportExtraMinutes = extraMinutes;
    const reportActionWithExtraMinutes = actionWithExtraMinutes;
    const reportComment = comment[0];
    setReportSubmitted(true);
  };

  const handleTheTransferButtonClick = () => {
    setActionWithExtraMinutes('transfer');
    setTransferMinutesPopUpOpen(false);
    confirmReport();
  };

  const handleTheKeepItButtonClick = () => {
    setActionWithExtraMinutes('keep');
    setTransferMinutesPopUpOpen(false);
    confirmReport();
  };

  const handleTheUndoSubmission = () => {
    setReportSubmitted(false);
  };

  const [reportSubmitted, setReportSubmitted] = useState(false);

  const [transferMinutesPopUpOpen, setTransferMinutesPopUpOpen] =
    useState(false);
  const [actionWithExtraMinutes, setActionWithExtraMinutes] =
    useState<TransferMinutesVariant>(null);
  const [extraMinutes, setExtraMinutes] = useState(0);

  const defaultEAABSValue = {
    darkOverlayOpen: false,
    popUpWindowOpen: false,
    variant: 'add',
    itemValue: '',
    itemIndex: 0,
  };

  const [editAndAddBibleStudyData, setEditAndAddBibleStudyData] = useState(
    () => {
      return defaultEAABSValue;
    }
  );

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      editAndAddBibleStudyData,
      setEditAndAddBibleStudyData,
    }),
    [editAndAddBibleStudyData]
  );

  const [bibleStudiesList, setBibleStudiesList] = useState(
    [] /** Connect to API */
  );

  // TODO: Connect to API
  const [ministyDailyHistory, setMinistryDailyHistory] = useState(() => {
    return [];
  });

  // TODO: Connect to API
  const userType: MinistryReportVariants = 'base';

  const getTotalRecordByDailyHistory = () => {
    let ministryHoursInSeconds = 0;
    let creditHoursInSeconds = 0;
    let countOfStudies = 0;
    const studies = [];

    ministyDailyHistory.forEach((value) => {
      ministryHoursInSeconds += value.hours_in_seconds;
      creditHoursInSeconds += value.credit_hours_in_seconds;
      countOfStudies += value.count_of_bible_studies;

      studies.push(...value.bible_studies);
    });

    return new MinistryRecord(
      '',
      countOfStudies,
      ministryHoursInSeconds,
      creditHoursInSeconds,
      studies
    );
  };

  const getEmptyMinistryRecord = (): MinistryRecord => {
    return new MinistryRecord(new Date().toString(), 0, 0, 0, []);
  };

  const [recordActionMode, setRecordActionMode] =
    useState<MinistryRecordActionMode>('add');

  const onAddRecordButtonClick = () => {
    setRecordActionMode('add');
    setAddServiceTimeModalWindowOpen(true);
  };

  const [bufferRecord, setBufferRecord] = useState({
    record: getEmptyMinistryRecord(),
    index: null,
  });

  const onEditButtonClick = (value, index) => {
    setRecordActionMode('edit');
    setBufferRecord({
      record: value,
      index: index,
    });
    setAddServiceTimeModalWindowOpen(true);
  };

  const MonthlyReportSelecter = () => {
    if (ministyDailyHistory.length != 0) {
      return (
        <MonthlyReport
          months={null}
          variant={userType}
          record={getTotalRecordByDailyHistory()}
          commentOnChange={(event) => {
            comment[0] = event.target.value;
          }}
        />
      );
    }
    return (
      <MonthlyReport
        months={null}
        variant="empty"
        record={getEmptyMinistryRecord()}
        commentOnChange={(event) => {
          comment[0] = event.target.value;
        }}
      />
    );
  };

  const [durationInSeconds, setDurationInSeconds] = useState(() => {
    return convertDurationStringToSeconds('00:00');
  });

  const resetDurationToNull = () => {
    setDurationInSeconds(convertDurationStringToSeconds('00:00'));
  };

  const [addServiceTimeModalWindowOpen, setAddServiceTimeModalWindowOpen] =
    useState(false);

  const addServiceTimeModalWindowRef = useRef(null);

  return (
    <EditAndAddBibleStudyContext.Provider value={contextValue}>
      <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
        <PageTitle
          title={t('tr_report')}
          buttons={
            !reportSubmitted ? (
              <CustomButton
                variant="main"
                startIcon={<IconSend />}
                onClick={handleTheConfirmReport}
              >
                {t('tr_btnSubmitReport')}
              </CustomButton>
            ) : (
              <CustomButton
                variant="main"
                startIcon={<IconUndo />}
                onClick={handleTheUndoSubmission}
                sx={{
                  backgroundColor: 'var(--orange-main)',
                  '&:hover': {
                    backgroundColor: 'var(--orange-dark)',
                  },
                }}
              >
                {t('tr_btnUndoSumbission')}
              </CustomButton>
            )
          }
        />

        <Box sx={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              flexDirection: 'column',
              width: '100%',
              flexGrow: 1,
            }}
          >
            <MonthlyReportSelecter />
          </Box>

          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              flexDirection: 'column',
              width: '100%',
              flexGrow: 1,
            }}
          >
            <DailyHistory
              records={ministyDailyHistory}
              onAddButtonClick={onAddRecordButtonClick}
              onEditButtonClick={onEditButtonClick}
            ></DailyHistory>
          </Box>
        </Box>
      </Box>

      <DarkOverlay overlayIsOpened={addServiceTimeModalWindowOpen}>
        {/** TODO: Connect to API  | Add variant */}
        <AddServiceTimeModalWindow
          showCreditHours={true}
          duration={durationInSeconds}
          bibleStudiesList={bibleStudiesList}
          cancelButtonClick={() => {
            setAddServiceTimeModalWindowOpen(false);
            setEditAndAddBibleStudyData(defaultEAABSValue);
          }}
          mode={recordActionMode}
          recordForEdit={
            recordActionMode == 'edit'
              ? bufferRecord.record
              : getEmptyMinistryRecord()
          }
          addButtonClick={() => {
            resetDurationToNull();
            setAddServiceTimeModalWindowOpen(false);
          }}
          result={(result) => {
            if (recordActionMode == 'add') {
              setMinistryDailyHistory((prev) => {
                const updatedArray = [...prev, result];
                return updatedArray;
              });
            } else {
              setMinistryDailyHistory((prev) => {
                const updatedArray = [...prev];
                updatedArray[bufferRecord.index] = result;
                return updatedArray;
              });
            }
          }}
          open={true}
          reference={addServiceTimeModalWindowRef}
        />
        <PopUpForEditOrCreateBibleStudy
          variant={editAndAddBibleStudyData.variant as 'add' | 'edit'}
          value={editAndAddBibleStudyData.itemValue}
          open={editAndAddBibleStudyData.popUpWindowOpen}
          width={addServiceTimeModalWindowRef.current?.offsetWidth + 'px'}
          cancelButtonClick={() => {
            if (editAndAddBibleStudyData.variant == 'edit') {
              setBibleStudiesList((prev) => {
                const tmpArray = [...prev];
                tmpArray.splice(editAndAddBibleStudyData.itemIndex, 1);
                return tmpArray;
              });
            }
            setEditAndAddBibleStudyData(defaultEAABSValue);
          }}
          closeButtonClick={() =>
            setEditAndAddBibleStudyData(defaultEAABSValue)
          }
          saveButtonClick={(value) => {
            setBibleStudiesList((prev) => {
              const tmpArray = [...prev];

              if (editAndAddBibleStudyData.variant == 'add') {
                tmpArray.push(value);
              } else {
                tmpArray[editAndAddBibleStudyData.itemIndex] = value;
              }

              return tmpArray;
            });

            setEditAndAddBibleStudyData(defaultEAABSValue);
          }}
        />
      </DarkOverlay>

      <DarkOverlay overlayIsOpened={transferMinutesPopUpOpen}>
        <TransferMinutesPopUp
          extraMinutes={extraMinutes}
          transferButtonClick={handleTheTransferButtonClick}
          keepButtonClick={handleTheKeepItButtonClick}
        />
      </DarkOverlay>
    </EditAndAddBibleStudyContext.Provider>
  );
};

export default MinistryReport;
