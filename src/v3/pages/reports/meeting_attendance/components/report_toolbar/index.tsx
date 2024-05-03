import React, { useState } from 'react';
import { MenuItem, Typography, useMediaQuery, useTheme } from '@mui/material';
import { getTheocraticalMonthListInAYear, getTheocraticalYearsList, getTeochraticalYear } from '@utils/date';
import { StyledBox, StyledSelect } from './index.styles';
import { MeetingAttendanceReportToolbarData, MeetingAttendanceReportToolbarProps } from './index.types';
const NUMBER_OF_YEARS = 5;

const MeetingAttendanceToolbar = ({ t }: MeetingAttendanceReportToolbarProps) => {
  const theme = useTheme();
  const laptopView = useMediaQuery(theme.breakpoints.up('laptop'), {
    noSsr: true,
  });

  const [data, setData] = useState<MeetingAttendanceReportToolbarData>({
    selectedYear: getTeochraticalYear(new Date()),
    selectedMonth: new Date().getMonth(),
  });

  const yearsList = getTheocraticalYearsList(NUMBER_OF_YEARS);
  const monthList = getTheocraticalMonthListInAYear(data.selectedYear);

  return (
    <StyledBox laptopView={laptopView}>
      <StyledSelect
        label={t('tr_serviceYear')}
        onChange={(e) => setData({ ...data, selectedYear: parseInt(e.target.value) })}
        value={data.selectedYear.toString()}
      >
        {yearsList.map((year, index) => {
          return (
            <MenuItem key={`year-${index.toString()}`} value={index.toString()}>
              <Typography className="body-regular" color="var(--black)">
                {year}
              </Typography>
            </MenuItem>
          );
        })}
      </StyledSelect>

      <StyledSelect
        label={t('tr_month')}
        onChange={(e) => setData({ ...data, selectedMonth: parseInt(e.target.value) })}
        value={data.selectedMonth.toString()}
      >
        {monthList.map((month, index) => (
          <MenuItem key={`month-${index.toString()}`} value={index.toString()}>
            <Typography className="body-regular" color="var(--black)">
              {month}
            </Typography>
          </MenuItem>
        ))}
      </StyledSelect>
    </StyledBox>
  );
};

export default MeetingAttendanceToolbar;
