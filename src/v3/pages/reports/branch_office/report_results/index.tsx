import React from 'react';
import { Typography } from '@mui/material';
import { CardHeader } from '@components/index';
import {
  BranchOfficeS10ReportResult,
  BranchOfficeS1ReportResult,
} from '../index.types';
import {
  StyledDivider,
  StyledColumnBox,
  StyledContentBox,
  StyledContentCardBox,
  StyledRowBox,
  StyledHeaderBox,
} from './index.styles';

import { TFunction } from 'i18next';

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

export const BranchS1ReportResult = (
  data: BranchOfficeS1ReportResult,
  t: TFunction<'translation', undefined>,
  month: string
) => {
  return (
    <StyledContentBox>
      <StyledContentCardBox>
        <StyledColumnBox gap="16px">
          <Typography className="h2" color="var(--black)">
            {month}
          </Typography>
          <StyledColumnBox gap="8px">
            <ReportResultElement
              title={t('tr_activePublishers')}
              value={data.activePublishers.toString()}
            />
            <StyledDivider />
            <ReportResultElement
              title={t('tr_averageAttendanceWM')}
              value={data.weekendMeetingAttendanceAvg.toString()}
            />
          </StyledColumnBox>
        </StyledColumnBox>
      </StyledContentCardBox>
      <StyledContentCardBox>
        <StyledColumnBox gap="16px">
          <Typography className="h2" color="var(--black)">
            {'Field service'}
          </Typography>
          <StyledColumnBox gap="8px">
            <CardHeader
              className={'h4'}
              header={t('tr_publishers')}
              size={'small'}
            />
            <ReportResultElement
              title={t('tr_numberReports')}
              value={data.totalReports.toString()}
            />
            <StyledDivider />
            <ReportResultElement
              title={t('tr_bibleStudies')}
              value={data.totalBibleStudies.toString()}
            />
          </StyledColumnBox>
          <StyledColumnBox gap="8px">
            <CardHeader className={'h4'} header={t('tr_AP')} size={'small'} />
            <ReportResultElement
              title={t('tr_numberReports')}
              value={data.auxPioneersReports.toString()}
            />
            <StyledDivider />
            <ReportResultElement
              title={t('tr_hours')}
              value={data.auxPioneersHours.toString()}
            />

            <StyledDivider />
            <ReportResultElement
              title={t('tr_bibleStudies')}
              value={data.auxPioneersBibleStudies.toString()}
            />
          </StyledColumnBox>
          <StyledColumnBox gap="8px">
            <CardHeader className={'h4'} header={t('tr_FRs')} size={'small'} />
            <ReportResultElement
              title={t('tr_numberReports')}
              value={data.regPioneersReports.toString()}
            />
            <StyledDivider />
            <ReportResultElement
              title={t('tr_hours')}
              value={data.regPioneersHours.toString()}
            />
            <StyledDivider />
            <ReportResultElement
              title={t('tr_bibleStudies')}
              value={data.regPioneersBibleStudies.toString()}
            />
          </StyledColumnBox>
        </StyledColumnBox>
      </StyledContentCardBox>
    </StyledContentBox>
  );
};

export const BranchS10ReportResult = (
  data: BranchOfficeS10ReportResult,
  t: TFunction<'translation', undefined>,
  year: string,
  congName: string
) => {
  return (
    <StyledContentBox>
      <StyledContentCardBox>
        <StyledColumnBox gap="16px">
          <StyledHeaderBox>
            <Typography className="h2" color="var(--black)">
              {`${t('tr_analysisReport')} ${year}`}
            </Typography>
            <Typography className="h4" color="var(--grey-400)">
              {congName}
            </Typography>
          </StyledHeaderBox>
          <StyledColumnBox gap="8px">
            <CardHeader
              className={'h4'}
              header={t('tr_meetingAttendance')}
              size={'small'}
            />
            <ReportResultElement
              title={t('tr_verageAttendanceMM')}
              value={data.midweekMeetingAttendanceAvg.toString()}
            />
            <StyledDivider />
            <ReportResultElement
              title={t('tr_averageAttendanceWM')}
              value={data.weekendMeetingAttendanceAvg.toString()}
            />
          </StyledColumnBox>
          <StyledColumnBox gap="8px">
            <CardHeader
              className={'h4'}
              header={t('tr_publishers')}
              size={'small'}
            />
            <ReportResultElement
              title={t('tr_activePublishers')}
              value={data.activePublishers.toString()}
            />
            <StyledDivider />
            <ReportResultElement
              title={t('tr_inactivePublishers')}
              value={data.inactivePublishers.toString()}
            />
            <StyledDivider />
            <ReportResultElement
              title={t('tr_reactivatedPublishers')}
              value={data.reactivatedPublishers.toString()}
            />
          </StyledColumnBox>
          <StyledColumnBox gap="8px">
            <CardHeader
              className={'h4'}
              header={t('tr_territories')}
              size={'small'}
            />
            <ReportResultElement
              title={t('tr_totalNumberTerritories')}
              value={data.totalTerritories.toString()}
            />
            <StyledDivider />
            <ReportResultElement
              title={t('tr_uncoveredTerritories')}
              value={data.uncoveredTerritories.toString()}
            />
          </StyledColumnBox>
        </StyledColumnBox>
      </StyledContentCardBox>
    </StyledContentBox>
  );
};
