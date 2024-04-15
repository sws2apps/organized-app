import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import Typography from '@mui/material/Typography';
import { Persons } from '../../classes/Persons';
import { getMonthName } from '../../utils/app';
import UserPendingS4Field from './UserPendingS4Field';
import { ServiceYear } from '../../classes/ServiceYear';
import { S21s } from '../../classes/S21s';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import {
  apiApprovePendingFieldServiceReports,
  apiDisapprovePendingFieldServiceReports,
  apiGetPendingFieldServiceReports,
} from '../../api';
import { displayError } from '../../utils/error';
import { pendingFieldServiceReportsState } from '../../states/report';
import { MinutesReports } from '../../classes/MinutesReports';

const UserPendingS4Report = ({ report }) => {
  const { t } = useTranslation('ui');

  const queryClient = useQueryClient();

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setPendingFieldServiceReports = useSetRecoilState(pendingFieldServiceReportsState);

  const [hasError, setHasError] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isDisapproving, setIsDisapproving] = useState(false);
  const [isHourLess, setIsHourLess] = useState(false);
  const [hourLess, setHourLess] = useState(false);

  const person = Persons.get(report.user_local_uid);
  const monthName = getMonthName(report.month);

  const handleApproveReport = async () => {
    try {
      setIsApproving(true);
      const localUid = report.user_local_uid;

      const result = await apiApprovePendingFieldServiceReports(localUid, report.month);

      if (result.status !== 200) {
        setAppMessage(displayError(result.data.message));
        setAppSeverity('warning');
        setIsApproving(false);
        setAppSnackOpen(true);
        return;
      }

      const currentServiceYear = ServiceYear.getByMonth(report.month).uid;

      let currentS21 = S21s.get(currentServiceYear, localUid);
      if (!currentS21) {
        currentS21 = await S21s.add(currentServiceYear, localUid);
      }

      const hours = report.duration === '' ? '' : +report.duration.split(':')[0];
      const minutes = report.duration === '' ? '' : +report.duration.split(':')[1];

      await currentS21.initializeMonth(report.month);
      await currentS21.saveMonthReport(report.month, { field: 'placements', value: report.placements });
      await currentS21.saveMonthReport(report.month, { field: 'videos', value: report.videos });

      const hasMinutesReport = MinutesReports.find(localUid, report.month);
      if (hasMinutesReport) {
        await MinutesReports.remove(localUid, report.month);
      }

      if (!hourLess) {
        await currentS21.saveMonthReport(report.month, { field: 'hours', value: hours });
        await currentS21.saveMonthReport(report.month, { field: 'minutes', value: '' });
      }

      if (hourLess) {
        await currentS21.saveMonthReport(report.month, { field: 'hours', value: '' });
        await currentS21.saveMonthReport(report.month, { field: 'minutes', value: minutes });

        await MinutesReports.add(localUid, report.month);
      }

      await currentS21.saveMonthReport(report.month, { field: 'returnVisits', value: report.returnVisits });
      await currentS21.saveMonthReport(report.month, { field: 'bibleStudies', value: report.bibleStudies });
      await currentS21.saveMonthReport(report.month, { field: 'comments', value: report.comments });

      const data = await queryClient.prefetchQuery({
        queryKey: ['pendingFieldServiceReports'],
        queryFn: apiGetPendingFieldServiceReports,
      });

      if (data && data.status === 200 && data.data) {
        setPendingFieldServiceReports(data.data);
      }

      setIsApproving(false);
    } catch (err) {
      setAppMessage(err.message);
      setAppSeverity('error');
      setIsApproving(false);
      setAppSnackOpen(true);
    }
  };

  const handleDisapproveReport = async () => {
    try {
      setIsDisapproving(true);
      const localUid = report.user_local_uid;

      const result = await apiDisapprovePendingFieldServiceReports(localUid, report.month);

      if (result.status !== 200) {
        setAppMessage(displayError(result.data.message));
        setAppSeverity('warning');
        setIsDisapproving(false);
        setAppSnackOpen(true);
        return;
      }

      const data = await queryClient.prefetchQuery({
        queryKey: ['pendingFieldServiceReports'],
        queryFn: apiGetPendingFieldServiceReports,
      });

      if (data && data.status === 200 && data.data) {
        setPendingFieldServiceReports(data.data);
      }

      setIsDisapproving(false);
    } catch (err) {
      setAppMessage(err.message);
      setAppSeverity('warning');
      setIsDisapproving(false);
      setAppSnackOpen(true);
    }
  };

  useEffect(() => {
    setHasError(false);

    if (report.bibleStudies !== '' && report.returnVisits === '') {
      setHasError(true);
      return;
    }

    if (report.bibleStudies !== '' && report.returnVisits !== '') {
      if (report.returnVisits < report.bibleStudies) {
        setHasError(true);
      }
    }
  }, [report.returnVisits, report.bibleStudies]);

  useEffect(() => {
    setIsHourLess(false);

    if (report.duration !== '') {
      const minutes = +report.duration.split(':')[1];
      if (minutes > 0) {
        setIsHourLess(true);
      }
    }
  }, [report.duration]);

  return (
    <Box sx={{ maxWidth: '390px', minWidth: '250px', flexGrow: 1 }}>
      <Box sx={{ backgroundColor: '#3f51b5', color: 'white', padding: '5px 8px', borderRadius: '8px' }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>{person.person_name}</Typography>
        <Typography>{monthName}</Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
        <UserPendingS4Field field="placements" value={report.placements} />
        <UserPendingS4Field field="videos" value={report.videos} />
        <UserPendingS4Field field="hours" value={report.duration} />
        {isHourLess && (
          <FormControlLabel
            control={<Checkbox checked={hourLess} onChange={(e) => setHourLess(e.target.checked)} />}
            label={t('approvedLessOneHourReport')}
            sx={{
              marginLeft: '2px',
              '.MuiButtonBase-root': { padding: '4px' },
              '.MuiFormControlLabel-label': { lineHeight: 1.2 },
            }}
          />
        )}
        <UserPendingS4Field field="returnVisits" errorField={hasError} value={report.returnVisits} />
        <UserPendingS4Field field="bibleStudies" errorField={hasError} value={report.bibleStudies} />
        {hasError && (
          <Typography color="error" sx={{ fontSize: '14px' }}>
            {t('lessReturnVisitsError')}
          </Typography>
        )}
        <UserPendingS4Field field="comments" value={report.comments} />
      </Box>
      <Box sx={{ display: 'flex', gap: '8px', borderTop: '1px outset', marginTop: '15px', paddingTop: '10px' }}>
        <Button
          variant="outlined"
          startIcon={isApproving ? <CircularProgress size={25} /> : <CheckCircleIcon />}
          color="success"
          disabled={isApproving || isDisapproving}
          onClick={handleApproveReport}
        >
          {t('approve')}
        </Button>
        <Button
          variant="outlined"
          startIcon={isDisapproving ? <CircularProgress size={25} /> : <ThumbDownAltIcon />}
          color="error"
          disabled={isApproving || isDisapproving}
          onClick={handleDisapproveReport}
        >
          {t('disapprove')}
        </Button>
      </Box>
    </Box>
  );
};

export default UserPendingS4Report;
