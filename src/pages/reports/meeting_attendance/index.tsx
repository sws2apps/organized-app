import { Box, useTheme } from '@mui/material';
import { Button, PageTitle, CardHeader } from '@components/index';
import { IconPrepareReport } from '@components/icons';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import { useState } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';

import { MeetingAttendanceReportHistory } from './components/report_results';
import MeetingAttendanceToolbar from './components/report_toolbar';
import {
  StyledContentBox,
  StyledDivider,
  StyledBox,
  StyledReportBox,
} from './index.styles';
import { MeetingAttendanceTotalBox } from './components/total_box';
import { WeekBox } from './components/week_box';
import useMeetingAttendance from './useMeetingAttendance';
import { MeetingAttendanceType } from '@definition/meeting_attendance';
import { getTeochraticalYear } from '@utils/date';

const EMPTY_MEETING_ATTENDANCE: MeetingAttendanceType = {
  month_date: '',
  week_1: {
    midweek: {
      present: 0,
      online: 0,
    },
    weekend: {
      present: 0,
      online: 0,
    },
  },
  week_2: {
    midweek: {
      present: 0,
      online: 0,
    },
    weekend: {
      present: 0,
      online: 0,
    },
  },
  week_3: {
    midweek: {
      present: 0,
      online: 0,
    },
    weekend: {
      present: 0,
      online: 0,
    },
  },
  week_4: {
    midweek: {
      present: 0,
      online: 0,
    },
    weekend: {
      present: 0,
      online: 0,
    },
  },
  week_5: {
    midweek: {
      present: 0,
      online: 0,
    },
    weekend: {
      present: 0,
      online: 0,
    },
  },
};

const MeetingAttendanceReportsPage = () => {
  const theme = useTheme();
  const desktopView = useMediaQuery(theme.breakpoints.up('desktop'), {
    noSsr: true,
  });

  const { t } = useAppTranslation();

  const {
    handleAddMeetingAttendance,
    handleGetMeetingAttendance,
    handleGetMeetingAttendanceHistory,
  } = useMeetingAttendance();

  const [history, setHistory] = useState<MeetingAttendanceType[]>([]);

  const [selectedHistoryYear, setSelectedHistoryYear] = useState<number>(
    getTeochraticalYear(new Date())
  );

  const onChangeHistoryYear = async (year: number) => {
    const history = await handleGetMeetingAttendanceHistory(year);
    setHistory(history);
    setSelectedHistoryYear(year);
  };

  const [reportData, setReportData] = useState<MeetingAttendanceType>(
    EMPTY_MEETING_ATTENDANCE
  );

  let numberOfMeetingsMidweek = 0;
  const totalMidweek = [1, 2, 3, 4, 5].reduce((acc, weekNumber) => {
    const value = reportData[`week_${weekNumber}`]?.midweek?.present;
    if (value !== 0) {
      numberOfMeetingsMidweek += 1;
    }
    return acc + value;
  }, 0);
  const avgMidweek = Math.floor(
    totalMidweek / (numberOfMeetingsMidweek === 0 ? 1 : numberOfMeetingsMidweek)
  ).toString();

  let numberOfMeetingsWeekend = 0;
  const totalWeekend = [1, 2, 3, 4, 5].reduce((acc, weekNumber) => {
    const value = reportData[`week_${weekNumber}`]?.weekend?.present;
    if (value != 0) {
      numberOfMeetingsWeekend += 1;
    }
    return acc + value;
  }, 0);
  const avgWeekend = Math.floor(
    totalWeekend / (numberOfMeetingsWeekend === 0 ? 1 : numberOfMeetingsWeekend)
  ).toString();

  const onChangeWeek = async (
    weekNumber: number,
    weekend: boolean,
    value: number
  ) => {
    const week = `week_${weekNumber ?? 0}`;
    const meetingType = weekend ? 'weekend' : 'midweek';

    if (Number.isNaN(value)) value = 0;

    const updatedData: MeetingAttendanceType = {
      ...reportData,
      [week]: {
        ...reportData[week],
        [meetingType]: {
          ...reportData[week][meetingType],
          present: value,
        },
      },
    };

    setReportData(updatedData);
    await handleAddMeetingAttendance(updatedData);
    setHistory(await handleGetMeetingAttendanceHistory(selectedHistoryYear));
  };

  const onChangeDate = async (date: string) => {
    const data = await handleGetMeetingAttendance(date);
    setReportData(
      data ? { ...data } : { ...EMPTY_MEETING_ATTENDANCE, month_date: date }
    );
  };

  return (
    <StyledContentBox>
      <PageTitle
        title={t('tr_meetingAttendanceRecord')}
        buttons={
          <Button
            variant="main"
            startIcon={<IconPrepareReport />}
            href="#/reports/branch-office"
          >
            {t('tr_createS1')}
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
          <MeetingAttendanceToolbar t={t} onChangeDate={onChangeDate} />
          <StyledDivider />

          <StyledBox row={false}>
            <CardHeader
              header={t('tr_midweekMeeting')}
              size="large"
              color="midweek-meeting"
            />
            <StyledBox row>
              {[1, 2, 3, 4, 5].map((weekNumber) => (
                <WeekBox
                  key={weekNumber}
                  weekNumber={weekNumber}
                  weekend={false}
                  onChange={onChangeWeek}
                  t={t}
                  value={reportData[`week_${weekNumber}`]?.midweek?.present}
                />
              ))}
            </StyledBox>
            <StyledBox row>
              <MeetingAttendanceTotalBox
                label="Total"
                value={totalMidweek}
                type="midweek"
              />
              <MeetingAttendanceTotalBox
                label="Average"
                value={avgMidweek}
                type="midweek"
              />
            </StyledBox>
          </StyledBox>
          <StyledBox row={false}>
            <CardHeader
              header={t('tr_weekendMeeting')}
              size="large"
              color="weekend-meeting"
            />
            <StyledBox row>
              {[1, 2, 3, 4, 5].map((weekNumber) => (
                <WeekBox
                  key={weekNumber}
                  weekNumber={weekNumber}
                  weekend
                  onChange={onChangeWeek}
                  t={t}
                  value={reportData[`week_${weekNumber}`]?.weekend?.present}
                />
              ))}
            </StyledBox>
            <StyledBox row>
              <MeetingAttendanceTotalBox
                label="Total"
                value={totalWeekend}
                type="weekend"
              />
              <MeetingAttendanceTotalBox
                label="Average"
                value={avgWeekend}
                type="weekend"
              />
            </StyledBox>
          </StyledBox>
        </StyledReportBox>

        <Box sx={{ flex: desktopView && 15 }}>
          {MeetingAttendanceReportHistory(t, history, onChangeHistoryYear)}
        </Box>
      </StyledBox>
    </StyledContentBox>
  );
};

export default MeetingAttendanceReportsPage;
