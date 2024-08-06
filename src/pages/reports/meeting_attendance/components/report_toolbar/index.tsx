import React, { useEffect, useState } from 'react';
import { MenuItem, Typography, useMediaQuery, useTheme } from '@mui/material';
import {
  getTheocraticalMonthListInAYear,
  getTheocraticalYearsList,
  getTeochraticalYear,
  getTheocraticalMonthDate,
} from '@utils/date';
import { StyledBox, StyledSelect } from './index.styles';
import {
  MeetingAttendanceReportToolbarData,
  MeetingAttendanceReportToolbarProps,
} from './index.types';
import { useAppTranslation } from '@hooks/index';

const NUMBER_OF_YEARS = 5;

const MeetingAttendanceToolbar = ({
  onChangeDate,
}: MeetingAttendanceReportToolbarProps) => {
  const theme = useTheme();
  const laptopView = useMediaQuery(theme.breakpoints.up('laptop'), {
    noSsr: true,
  });

  const { t } = useAppTranslation();

  const [data, setData] = useState<MeetingAttendanceReportToolbarData>({
    selectedYear: getTeochraticalYear(new Date()),
    selectedMonth: new Date().getMonth(),
  });

  const yearsList = getTheocraticalYearsList(NUMBER_OF_YEARS);
  const monthList = getTheocraticalMonthListInAYear(data.selectedYear);

  const onChangeMonth = (month: number) => {
    setData({ ...data, selectedMonth: month });
    onChangeDate(getTheocraticalMonthDate(month, data.selectedYear));
  };

  const onChangeYear = (year: number) => {
    setData({ ...data, selectedYear: year });
    onChangeDate(getTheocraticalMonthDate(data.selectedMonth, year));
  };

  useEffect(() => {
    onChangeDate(
      getTheocraticalMonthDate(data.selectedMonth, data.selectedYear)
    );
  }, []);

  return (
    <StyledBox laptopView={laptopView}>
      <StyledSelect
        label={t('tr_serviceYear')}
        onChange={(e) => onChangeYear(parseInt(e.target.value))}
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
        onChange={(e) => onChangeMonth(parseInt(e.target.value))}
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
