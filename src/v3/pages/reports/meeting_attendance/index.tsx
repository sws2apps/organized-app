import { Box, MenuItem, useTheme } from '@mui/material';
import { Button, PageTitle, InfoTip, CardHeader, TextField, ScrollableTabs } from '@components/index';
import { IconArrowLink, IconCheckCircle, IconInfo, IconPrepareReport, IconUndo } from '@components/icons';
import Typography from '@components/typography';
import Select from '@components/select';
import { useAppTranslation } from '@hooks/index';
import { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

import { MeetingAttendanceReportResult } from './components/report_results';
import MeetingAttendanceToolbar from './components/report_toolbar';
import { MeetingAttendanceReportToolbarData } from './components/report_toolbar/index.types';
import { congNameState } from '@states/settings';
import { useRecoilValue } from 'recoil';
import {
  StyledContentBox,
  StyledDivider,
  StyledBox,
  StyledReportBox,
  StyledContentCardBox,
  StyledColumnBox,
  StyledHeaderBox,
} from './index.styles';
import { MeetingAttendanceTotalBox } from './components/total_box';
import { WeekBox } from './components/week_box';

const MeetingAttendanceReportsPage = () => {
  const theme = useTheme();
  const desktopView = useMediaQuery(theme.breakpoints.up('desktop'), {
    noSsr: true,
  });

  const { t } = useAppTranslation();

  //This should be refactored adter implementing the real data
  const [reportResultData, setReportResultData] = useState({
    year: 0,
    month: 0,
    yearRepresentation: '',
    monthRepresentation: '',
  });

  const onChangeWeek = (weekNumber: number, weekend: boolean, value: number) => {
    console.log(weekNumber, weekend, value);
  };

  const onGenerateReport = (
    result: MeetingAttendanceReportToolbarData,
    yearRepresentation: string,
    monthRepresentation: string
  ) => {
    const timer = setTimeout(() => {
      setReportResultData({
        year: result.selectedYear,
        month: result.selectedMonth,
        yearRepresentation,
        monthRepresentation,
      });
    }, 5000);

    return () => clearTimeout(timer);
  };

  return (
    <StyledContentBox>
      <PageTitle
        title={t('tr_meetingAttendanceRecord')}
        backTo="/"
        buttons={
          <Button variant="main" startIcon={<IconPrepareReport />}>
            {'Create S-1 Report'}
          </Button>
        }
      />

      <StyledBox row={desktopView}>
        <StyledReportBox desktopView={desktopView}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Typography className="h2" color="var(--black)">
              {`${t('tr_recordAttendance')}`}
            </Typography>
            <Typography className="body-regular" color="var(--grey-400)">
              {t('tr_recordAttendanceDesc')}
            </Typography>
          </Box>
          <MeetingAttendanceToolbar t={t} />
          <StyledDivider />

          <StyledBox row={false}>
            <CardHeader header={t('tr_midweekMeeting')} size="large" color="midweek-meeting" />
            <StyledBox row>
              {<WeekBox weekNumber={1} weekend={false} onChange={onChangeWeek} t={t} />}
              {<WeekBox weekNumber={2} weekend={false} onChange={onChangeWeek} t={t} />}
              {<WeekBox weekNumber={3} weekend={false} onChange={onChangeWeek} t={t} />}
              {<WeekBox weekNumber={4} weekend={false} onChange={onChangeWeek} t={t} />}
              {<WeekBox weekNumber={5} weekend={false} onChange={onChangeWeek} t={t} />}
            </StyledBox>
            <StyledBox row>
              <MeetingAttendanceTotalBox label="Total" value="121" type="midweek" />
              <MeetingAttendanceTotalBox label="Average" value="49" type="midweek" />
            </StyledBox>
          </StyledBox>
          <StyledBox row={false}>
            <CardHeader header={t('tr_weekendMeeting')} size="large" color="weekend-meeting" />
            <StyledBox row>
              {<WeekBox weekNumber={1} weekend onChange={onChangeWeek} t={t} />}
              {<WeekBox weekNumber={2} weekend onChange={onChangeWeek} t={t} />}
              {<WeekBox weekNumber={3} weekend onChange={onChangeWeek} t={t} />}
              {<WeekBox weekNumber={4} weekend onChange={onChangeWeek} t={t} />}
              {<WeekBox weekNumber={5} weekend onChange={onChangeWeek} t={t} />}
            </StyledBox>
            <StyledBox row>
              <MeetingAttendanceTotalBox label="Total" value="121" type="weekend" />
              <MeetingAttendanceTotalBox label="Average" value="49" type="weekend" />
            </StyledBox>
          </StyledBox>
        </StyledReportBox>

        <Box sx={{ flex: desktopView && 15 }}>{MeetingAttendanceReportResult(t)}</Box>
      </StyledBox>
    </StyledContentBox>
  );
};

export default MeetingAttendanceReportsPage;
