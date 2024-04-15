import { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import MenuItem from '@mui/material/MenuItem';
import ReplayIcon from '@mui/icons-material/Replay';
import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ServiceYear } from '../classes/ServiceYear';
import { S4DailyRecord, S4DailyRecordItem, UserS4 } from '../features/userFieldServiceReports';
import { UserS4MonthlyReport } from '../classes/UserS4MonthlyReport';
import { refreshReportState } from '../states/report';
import { congAccountConnectedState } from '../states/congregation';
import { Setting } from '../classes/Setting';
import { UserS4Records } from '../classes/UserS4Records';

const UserFieldServiceReport = () => {
  const { t } = useTranslation('ui');

  const [refreshScreen, setRefreshScreen] = useRecoilState(refreshReportState);

  const congAccountConnected = useRecoilValue(congAccountConnectedState);

  const [currentServiceYear, setCurrentServiceYear] = useState(
    ServiceYear.getByMonth(ServiceYear.currentReportMonth()).uid
  );
  const [currentMonth, setCurrentMonth] = useState('');
  const [allMonths, setAllMonths] = useState([]);
  const [openDailyRecord, setOpenDailyRecord] = useState(false);
  const [dailyRecords, setDailyRecords] = useState([]);
  const [showS4, setShowS4] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPending, setIsPending] = useState(true);
  const [isLocked, setIsLocked] = useState(false);
  const [date, setDate] = useState(null);

  const secretaryRole = Setting.cong_role.includes('secretary');

  const handleServiceYearChange = (value) => {
    setCurrentServiceYear(value);
  };

  const handleMonthChange = (value) => {
    setCurrentMonth(value);
  };

  const handlePrepareS4 = () => {
    setShowS4(true);
    setRefreshScreen((prev) => !prev);
  };

  const handleCloseS4 = () => {
    setShowS4(false);
  };

  const handleSubmitS4 = async () => {
    const currentS4 = await UserS4MonthlyReport.get(currentMonth);
    await currentS4.submit();

    setIsSubmitted(currentS4.isSubmitted);
  };

  const handleUndoSubmitS4 = async () => {
    const currentS4 = await UserS4MonthlyReport.get(currentMonth);
    await currentS4.undoSubmit();

    setIsSubmitted(currentS4.isSubmitted);
  };

  const handleDeleteDailyRecord = async (report_date) => {
    const currentReport = await UserS4Records.get(report_date);
    await UserS4Records.delete(currentReport.report_uid);
    setDate(null);

    const currentS4 = await UserS4MonthlyReport.get(currentMonth);
    setDailyRecords(currentS4.reports);
  };

  useEffect(() => {
    if (currentServiceYear !== '') {
      const options = ServiceYear.getMonths(currentServiceYear);
      setAllMonths(options);

      if (currentServiceYear === ServiceYear.getByMonth(ServiceYear.currentReportMonth()).uid) {
        let currentMonth;

        if (new Date().getDate() > 20) {
          currentMonth = new Date().getMonth();
        } else {
          currentMonth = new Date().getMonth() - 1;
        }
        if (currentMonth < 0) currentMonth = 0;
        const selected = options.find((option) => option.index === currentMonth);

        setCurrentMonth(selected.value);
      } else {
        setCurrentMonth(options[0].value);
      }
    }
  }, [currentServiceYear]);

  useEffect(() => {
    const initializeMonth = async () => {
      const currentS21 = UserS4Records.getS21(currentMonth);
      if (currentS21) {
        setIsLocked(true);
      }

      if (!currentS21) {
        const currentS4 = await UserS4MonthlyReport.get(currentMonth);
        setIsSubmitted(currentS4.isSubmitted);
        setIsPending(currentS4.isPending);
        setDailyRecords(currentS4.reports);
      }
    };

    if (currentMonth !== '') {
      initializeMonth();
    }
  }, [currentMonth, refreshScreen]);

  return (
    <Box>
      <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '20px' }}>
        {t('fieldServiceReport')}
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
        <TextField
          id="outlined-select-service-year"
          select
          label={t('serviceYear')}
          size="small"
          sx={{ minWidth: '200px' }}
          value={currentServiceYear}
          onChange={(e) => handleServiceYearChange(e.target.value)}
        >
          {ServiceYear.list.map((year) => (
            <MenuItem key={year.uid} value={year.uid}>
              {year.value}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="outlined-select-month"
          select
          label={t('selectMonth')}
          size="small"
          sx={{ minWidth: '250px' }}
          value={currentMonth}
          onChange={(e) => handleMonthChange(e.target.value)}
        >
          {allMonths.map((month) => (
            <MenuItem key={month.value} value={month.value}>
              {month.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <Box>
        <Box sx={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {!openDailyRecord && !isSubmitted && !isLocked && (
            <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setOpenDailyRecord(true)}>
              {t('edit')}
            </Button>
          )}

          {openDailyRecord && !isSubmitted && (
            <Button
              variant="outlined"
              startIcon={<ExpandCircleDownIcon sx={{ transform: 'rotate(180deg)' }} />}
              onClick={() => setOpenDailyRecord(false)}
            >
              {t('collapse')}
            </Button>
          )}

          {!isSubmitted && !isLocked && (
            <Button variant="outlined" color="success" startIcon={<FlashOnIcon />} onClick={handlePrepareS4}>
              {t('show')} S-4
            </Button>
          )}

          {showS4 && (
            <>
              {!isSubmitted && (
                <Button
                  variant="outlined"
                  color="success"
                  startIcon={<ExpandCircleDownIcon sx={{ transform: 'rotate(180deg)' }} />}
                  onClick={handleCloseS4}
                >
                  {t('collapse')} S-4
                </Button>
              )}

              {!isSubmitted && (secretaryRole || congAccountConnected) && (
                <Button variant="outlined" color="success" startIcon={<SendIcon />} onClick={handleSubmitS4}>
                  {t('submit')} S-4
                </Button>
              )}
            </>
          )}

          {isPending && isSubmitted && (secretaryRole || congAccountConnected) && (
            <Button variant="outlined" color="warning" startIcon={<ReplayIcon />} onClick={handleUndoSubmitS4}>
              {t('undoSubmit')}
            </Button>
          )}

          {!isPending && (
            <Typography sx={{ fontStyle: 'italic', fontSize: '14px' }} color="#FE4119">
              {t('userFieldServiceReportLocked')}
            </Typography>
          )}
        </Box>

        <S4DailyRecord isOpen={openDailyRecord} month={currentMonth} date={date} setDate={setDate} />
      </Box>

      <UserS4 isOpen={showS4 || isLocked || isSubmitted} isSubmitted={isSubmitted} month={currentMonth} />

      {!isSubmitted && (
        <Box sx={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
          {dailyRecords?.map((report) => {
            return (
              <Box key={report.report_uid}>
                {(report.placements > 0 ||
                  report.videos > 0 ||
                  report.duration !== 0 ||
                  report.returnVisits > 0 ||
                  report.bibleStudies.length > 0) && (
                  <S4DailyRecordItem report={report} handleDeleteDailyRecord={handleDeleteDailyRecord} />
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

export default UserFieldServiceReport;
