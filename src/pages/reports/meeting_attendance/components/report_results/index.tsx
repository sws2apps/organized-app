import React, { useEffect, useState } from 'react';
import { Typography, Box } from '@mui/material';
import { CardHeader, ScrollableTabs } from '@components/index';
import {
  StyledDivider,
  StyledColumnBox,
  StyledContentBox,
  StyledContentCardBox,
  StyledRowBox,
  StyledHeaderBox,
} from './index.styles';
import { useAppTranslation } from '@hooks/index';
import { TFunction } from 'i18next';
import {
  getTeochraticalYear,
  getTheocraticalMonthDate,
  getTheocraticalMonthListInAYear,
  getTheocraticalYearsList,
} from '@utils/date';
import { MeetingAttendanceType } from '@definition/meeting_attendance';

const NUMBER_OF_YEARS = 5;

const ReportResultElement = ({
  title,
  value,
}: {
  title: string;
  value: string;
}) => {
  return (
    <StyledRowBox>
      <StyledRowBox sx={{ width: '100%' }}>
        <Typography className="body-regular" color="var(--black)">
          {title}
        </Typography>
        <Typography className="h4" color="var(--black)">
          {value}
        </Typography>
      </StyledRowBox>
    </StyledRowBox>
  );
};

const ReportHistoryMonthBox = ({
  title,
  data,
}: {
  title: string;
  data?: MeetingAttendanceType;
}) => {
  const { t } = useAppTranslation();
  let numberOfMeetingsWeekend = 0;
  const totalMidweek = data
    ? [1, 2, 3, 4, 5].reduce((acc, weekNumber) => {
        const value = data[`week_${weekNumber}`]?.weekend?.present;
        if (value !== 0) {
          numberOfMeetingsWeekend += 1;
        }
        return acc + value;
      }, 0)
    : 0;
  const avgMidweek = data
    ? Math.floor(
        totalMidweek /
          (numberOfMeetingsWeekend === 0 ? 1 : numberOfMeetingsWeekend)
      ).toString()
    : '0';

  let numberOfMeetingsMidweek = 0;
  const totalWeekend = data
    ? [1, 2, 3, 4, 5].reduce((acc, weekNumber) => {
        const value = data[`week_${weekNumber}`]?.midweek?.present;
        if (value != 0) {
          numberOfMeetingsMidweek += 1;
        }
        return acc + value;
      }, 0)
    : 0;
  const avgWeekend = data
    ? Math.floor(
        totalWeekend /
          (numberOfMeetingsMidweek === 0 ? 1 : numberOfMeetingsMidweek)
      ).toString()
    : '0';

  return (
    <CardHeader header={title} size="small">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          gap: '24px',
          justifyContent: 'space-between',
          paddingTop: '16px',
          paddingBottom: '8px',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '100%',
          }}
        >
          <Typography className="h3" color="var(--black)">
            {t('tr_midweekMeeting')}
          </Typography>
          <ReportResultElement
            title={'Number of meetings'}
            value={numberOfMeetingsMidweek.toString()}
          />
          <StyledDivider />
          <ReportResultElement
            title={'Total attendance'}
            value={totalMidweek}
          />
          <StyledDivider />
          <ReportResultElement
            title={'Average attendance'}
            value={avgMidweek}
          />
          <StyledDivider />
          <ReportResultElement title={'Average online'} value={'0'} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            border: '1px solid var(--accent-150)',
          }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '100%',
          }}
        >
          <Typography className="h3" color="var(--black)">
            {t('tr_weekendMeeting')}
          </Typography>
          <ReportResultElement
            title={'Number of meetings'}
            value={numberOfMeetingsWeekend.toString()}
          />
          <StyledDivider />
          <ReportResultElement
            title={'Total attendance'}
            value={totalWeekend}
          />
          <StyledDivider />
          <ReportResultElement
            title={'Average attendance'}
            value={avgWeekend}
          />
          <StyledDivider />
          <ReportResultElement title={'Average online'} value={'0'} />
        </Box>
      </Box>
    </CardHeader>
  );
};
export const MeetingAttendanceReportHistory = (
  t: TFunction<'translation', undefined>,
  history: MeetingAttendanceType[],
  onChangeHistoryYear: (year: number) => void
) => {
  const yearsList = getTheocraticalYearsList(NUMBER_OF_YEARS);
  const [currentYear, setCurrentYear] = useState(
    getTeochraticalYear(new Date())
  );

  const monthList = getTheocraticalMonthListInAYear(currentYear);
  const onYearChange = async (index: number) => {
    setCurrentYear(index);
    onChangeHistoryYear(index);
  };

  useEffect(() => {
    onChangeHistoryYear(currentYear);
  }, []);

  return (
    <StyledContentBox>
      <StyledContentCardBox>
        <StyledColumnBox gap="16px">
          <StyledHeaderBox>
            <Typography className="h2" color="var(--black)">
              {t('tr_monthlyHistory')}
            </Typography>
            <Typography className="body-regular" color="var(--grey-400)">
              {t('tr_recordAttendanceDesc')}
            </Typography>
          </StyledHeaderBox>
          <StyledColumnBox gap="16px">
            <ScrollableTabs
              tabs={yearsList.map((year, index) => ({
                label: index.toString(),
                Component: <></>,
              }))}
              value={NUMBER_OF_YEARS - 1}
              onChange={onYearChange}
            ></ScrollableTabs>
            <StyledColumnBox gap="16px">
              {monthList.map((month, index) => {
                const currentMonthDate = getTheocraticalMonthDate(
                  index,
                  currentYear
                );
                const monthData = history.find(
                  (data) => data.month_date === currentMonthDate
                );

                return (
                  <ReportHistoryMonthBox
                    key={index.toString()}
                    title={month}
                    t={t}
                    data={monthData}
                  />
                );
              })}
            </StyledColumnBox>
          </StyledColumnBox>
        </StyledColumnBox>
      </StyledContentCardBox>
    </StyledContentBox>
  );
};
