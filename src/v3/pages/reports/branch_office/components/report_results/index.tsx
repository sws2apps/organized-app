import React from 'react';
import { Typography } from '@mui/material';
import { CardHeader } from '@components/index';
import { BranchOfficeS10ReportResult, BranchOfficeS1ReportResult } from '../../index.types';
import { StyledDivider, StyledColumnBox, StyledContentBox, StyledContentCardBox, StyledRowBox } from './index.styles';

import { TFunction } from 'i18next';

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

export const BranchS1ReportResult = (data: BranchOfficeS1ReportResult, t: TFunction<'translation', undefined>) => {
  return (
    <StyledContentBox>
      <StyledContentCardBox>
        <StyledColumnBox gap="8px">
          <ReportResultElement title={t('tr_activePublishers')} value={data.activePublishers.toString()} />
          <StyledDivider />
          <ReportResultElement
            title={t('tr_averageAttendanceWM')}
            value={data.weekendMeetingAttendanceAvg.toString()}
          />
        </StyledColumnBox>
      </StyledContentCardBox>
      <StyledContentCardBox>
        <StyledColumnBox gap="16px">
          <Typography className="h2" color="var(--black)">
            {'Field service'}
          </Typography>
          <StyledColumnBox gap="8px">
            <CardHeader className={'h4'}>{t('tr_publishers')}</CardHeader>
            <ReportResultElement title={t('tr_numberReports')} value={'82'} />
            <StyledDivider />
            <ReportResultElement title={t('tr_bibleStudies')} value={'9'} />
          </StyledColumnBox>
          <StyledColumnBox gap="8px">
            <CardHeader className={'h4'}>{t('tr_AP')}</CardHeader>
            <ReportResultElement title={t('tr_numberReports')} value={'4'} />
            <StyledDivider />
            <ReportResultElement title={t('tr_hours')} value={'127'} />

            <StyledDivider />
            <ReportResultElement title={t('tr_bibleStudies')} value={'1'} />
          </StyledColumnBox>
          <StyledColumnBox gap="8px">
            <CardHeader className={'h4'}>{t('tr_regPioneers')}</CardHeader>
            <ReportResultElement title={t('tr_numberReports')} value={'15'} />
            <StyledDivider />
            <ReportResultElement title={t('tr_hours')} value={'791'} />
            <StyledDivider />
            <ReportResultElement title={t('tr_bibleStudies')} value={'8'} />
          </StyledColumnBox>
        </StyledColumnBox>
      </StyledContentCardBox>
    </StyledContentBox>
  );
};

export const BranchS10ReportResult = (
  data: BranchOfficeS10ReportResult,
  t: TFunction<'translation', undefined>,
  congName: string
) => {
  return (
    <StyledContentBox>
      <StyledContentCardBox>
        <StyledColumnBox gap="16px">
          <Typography className="h2" color="var(--black)">
            {t('tr_analysisReport')}
          </Typography>
          <Typography className="h4" color="var(--grey-400)">
            {congName}
          </Typography>
          <StyledColumnBox gap="8px">
            <CardHeader className={'h4'}>{'Meeting attendance'}</CardHeader>
            <ReportResultElement title={t('tr_verageAttendanceMM')} value={'89'} />
            <StyledDivider />
            <ReportResultElement title={t('tr_averageAttendanceWM')} value={'105'} />
          </StyledColumnBox>
          <StyledColumnBox gap="8px">
            <CardHeader className={'h4'}>{t('tr_publishers')}</CardHeader>
            <ReportResultElement title={t('tr_activePublishers')} value={'102'} />
            <StyledDivider />
            <ReportResultElement title={t('tr_inactivePublishers')} value={'3'} />
            <StyledDivider />
            <ReportResultElement title={t('tr_reactivatedPublishers')} value={'1'} />
          </StyledColumnBox>
          <StyledColumnBox gap="8px">
            <CardHeader className={'h4'}>{t('tr_territories')}</CardHeader>
            <ReportResultElement title={t('tr_totalNumberTerritories')} value={'157'} />
            <StyledDivider />
            <ReportResultElement title={t('tr_uncoveredTerritories')} value={'12'} />
          </StyledColumnBox>
        </StyledColumnBox>
      </StyledContentCardBox>
    </StyledContentBox>
  );
};
