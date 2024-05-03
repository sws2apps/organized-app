import { IconSend, IconUndo } from '@components/icons';
import PageTitle from '@components/page_title';
import useAppTranslation from '@hooks/useAppTranslation';
import useBreakpoints from '@hooks/useBreakpoints';
import { Box } from '@mui/material';
import MonthlyReport from './components/monthly_report';
import CustomButton from '@components/button';
import { MinistryRecord } from './ministry_report.types';
import { useMemo, useState } from 'react';
import { EditAndAddBibleStudyContext } from '@features/ministry/EditAndAddBibleStudyContext';
import DarkOverlay from '@components/dark_overlay';
import PopUpForEditOrCreateBibleStudy from '@features/ministry/pop_up_for_edit_or_create_bible_study';
import { getTmpMinistryRecords } from './_tmpMinistryRecords';

const MinistryReport = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const handleTheConfirmReport = () => {
    setReportSubmitted(true);
  };

  const handleTheUndoSubmission = () => {
    setReportSubmitted(false);
  };

  const [reportSubmitted, setReportSubmitted] = useState(false);

  const defaultEAABSValue = {
    darkOverlayOpen: false,
    popUpWindowOpen: false,
    variant: 'add',
    itemValue: '',
    itemIndex: 0,
  };

  const [editAndAddBibleStudyData, setEditAndAddBibleStudyData] = useState(() => {
    return defaultEAABSValue;
  });

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      editAndAddBibleStudyData,
      setEditAndAddBibleStudyData,
    }),
    [editAndAddBibleStudyData]
  );

  const [bibleStudiesList, setBibleStudiesList] = useState([] /** Connect to API */);

  // This is test data for developers
  // TODO: Connect to API
  // You can uncomment, but this work with commit 0246d60dc2e3506a7648662e0c7ed2380a6091e1+
  const [ministyDailyHistory, setMinistryDailyHistory] = useState(() => {
    return getTmpMinistryRecords(10);
  });

  const userType = 'pioneer';

  const getTotalRecordByDailyHistory = () => {
    let ministryHoursInSeconds = 0;
    let creditHoursInSeconds = 0;
    let countOfStudies = 0;
    const studies = [];

    ministyDailyHistory.forEach((value, index) => {
      ministryHoursInSeconds += value.count_of_bible_studies;
      creditHoursInSeconds += value.credit_hours_in_seconds;
      countOfStudies += value.count_of_bible_studies;
      studies.concat(value.bible_studies);
    });

    return new MinistryRecord('', countOfStudies, ministryHoursInSeconds, creditHoursInSeconds, studies);
  };

  return (
    <EditAndAddBibleStudyContext.Provider value={contextValue}>
      <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
        <PageTitle
          title={t('tr_report')}
          backTo="/"
          buttons={
            !reportSubmitted ? (
              <CustomButton variant="main" startIcon={<IconSend />} onClick={handleTheConfirmReport}>
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

        <Box sx={{ display: 'flex', gap: '16px', flexWrap: desktopUp ? 'nowrap' : 'wrap' }}>
          <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column', width: '100%', flexGrow: 1 }}>
            <MonthlyReport
              variant={ministyDailyHistory.length !== 0 ? userType : 'empty'}
              bibleStudiesList={bibleStudiesList}
              record={getTotalRecordByDailyHistory()}
              months={null}
            />
          </Box>

          <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column', width: '100%', flexGrow: 1 }}></Box>
        </Box>
      </Box>

      <DarkOverlay overlayIsOpened={editAndAddBibleStudyData.darkOverlayOpen}>
        {/** Connect to API */}
        <PopUpForEditOrCreateBibleStudy
          variant={editAndAddBibleStudyData.variant as 'add' | 'edit'}
          value={editAndAddBibleStudyData.itemValue}
          open={editAndAddBibleStudyData.popUpWindowOpen}
          width="100%"
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
          closeButtonClick={() => setEditAndAddBibleStudyData(defaultEAABSValue)}
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
    </EditAndAddBibleStudyContext.Provider>
  );
};

export default MinistryReport;
