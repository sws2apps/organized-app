import React, { useState } from 'react';
import { MenuItem, Typography, useMediaQuery, useTheme } from '@mui/material';
import { IconGenerate, IconLoading, IconRegenerate } from '@components/icons';
import { getTheocraticalMonthListInAYear, getTheocraticalYearsList, getTeochraticalYear } from '@utils/date';
import { StyledBox, StyledButton, StyledSelect } from './index.styles';
import { BranchOfficeReportToolbarData, BranchOfficeReportToolbarProps } from './index.types';
const NUMBER_OF_YEARS = 5;

const BranchReportToolbar = ({ pageState, onGenerateReport, reportType }: BranchOfficeReportToolbarProps) => {
  const theme = useTheme();
  const laptopView = useMediaQuery(theme.breakpoints.up('laptop'), {
    noSsr: true,
  });

  const [data, setData] = useState<BranchOfficeReportToolbarData>({
    selectedYear: getTeochraticalYear(new Date()),
    selectedMonth: new Date().getMonth(),
  });

  const yearsList = getTheocraticalYearsList(NUMBER_OF_YEARS);
  const monthList = getTheocraticalMonthListInAYear(data.selectedYear);

  let buttonIcon;
  switch (pageState) {
    case 'generating':
      buttonIcon = <IconLoading width={22} height={22} color="var(--black)" />;
      break;
    case 'generated':
      buttonIcon = <IconRegenerate />;
      break;
    default:
      buttonIcon = <IconGenerate />;
      break;
  }

  return (
    <StyledBox laptopView={laptopView}>
      <StyledSelect
        label={'Service year'}
        onChange={(e) => setData({ ...data, selectedYear: parseInt(e.target.value) })}
        value={data.selectedYear.toString()}
        reportType={reportType}
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
      {reportType === 's1' && (
        <StyledSelect
          label={'Month'}
          onChange={(e) => setData({ ...data, selectedMonth: parseInt(e.target.value) })}
          value={data.selectedMonth.toString()}
          reportType={reportType}
        >
          {monthList.map((month, index) => (
            <MenuItem key={`month-${index.toString()}`} value={index.toString()}>
              <Typography className="body-regular" color="var(--black)">
                {month}
              </Typography>
            </MenuItem>
          ))}
        </StyledSelect>
      )}
      <StyledButton
        reportType={reportType}
        variant="tertiary"
        startIcon={buttonIcon}
        onClick={() => onGenerateReport(data)}
      >
        {pageState === 'generated' ? 'Regenerate' : 'Generate'}
      </StyledButton>
    </StyledBox>
  );
};

export default BranchReportToolbar;
