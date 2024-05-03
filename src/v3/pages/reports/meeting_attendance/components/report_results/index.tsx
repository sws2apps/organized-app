import React, { useState } from 'react';
import { Typography, Box } from '@mui/material';
import { CardHeader, ScrollableTabs } from '@components/index';
import { MeetingAttendanceS10ReportResult, MeetingAttendanceS1ReportResult } from '../../index.types';
import {
  StyledDivider,
  StyledColumnBox,
  StyledContentBox,
  StyledContentCardBox,
  StyledRowBox,
  StyledHeaderBox,
} from './index.styles';

import { TFunction } from 'i18next';
import { getTeochraticalYear, getTheocraticalMonthListInAYear, getTheocraticalYearsList } from '@utils/date';

const NUMBER_OF_YEARS = 5;

const ReportResultElement = ({ title, value }: { title: string; value: string }) => {
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

const ReportResultMonthBox = ({ title, t }: { title: string; t: TFunction<'translation', undefined> }) => {
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <Typography className="h3" color="var(--black)">
            {t('tr_midweekMeeting')}
          </Typography>
          <ReportResultElement title={'Number of meetings'} value={'5'} />
          <StyledDivider />
          <ReportResultElement title={'Total attendance'} value={'360'} />
          <StyledDivider />
          <ReportResultElement title={'Average attendance'} value={'85'} />
          <StyledDivider />
          <ReportResultElement title={'Average online'} value={'24(32%)'} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            border: '1px solid var(--accent-150)',
          }}
        ></Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
          <Typography className="h3" color="var(--black)">
            {t('tr_weekendMeeting')}
          </Typography>
          <ReportResultElement title={'Number of meetings'} value={'5'} />
          <StyledDivider />
          <ReportResultElement title={'Total attendance'} value={'360'} />
          <StyledDivider />
          <ReportResultElement title={'Average attendance'} value={'85'} />
          <StyledDivider />
          <ReportResultElement title={'Average online'} value={'24(32%)'} />
        </Box>
      </Box>
    </CardHeader>
  );
};
export const MeetingAttendanceReportResult = (t: TFunction<'translation', undefined>) => {
  const yearsList = getTheocraticalYearsList(NUMBER_OF_YEARS);
  console.log(yearsList);
  const [currentYear, setCurrentYear] = useState(getTeochraticalYear(new Date()));

  const monthList = getTheocraticalMonthListInAYear(currentYear);
  const onYearChange = (index: number) => {
    console.log(index);
  };

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
          <StyledColumnBox gap="16px" sx={{}}>
            <ScrollableTabs
              tabs={yearsList.map((year, index) => ({
                label: index.toString(),
                Component: <></>,
              }))}
              value={NUMBER_OF_YEARS - 1}
              onChangeTab={onYearChange}
            ></ScrollableTabs>
            <StyledColumnBox gap="16px">
              {monthList.map((month, index) => (
                <ReportResultMonthBox key={index.toString()} title={month} t={t} />
              ))}
            </StyledColumnBox>
          </StyledColumnBox>
        </StyledColumnBox>
      </StyledContentCardBox>
    </StyledContentBox>
  );
};
