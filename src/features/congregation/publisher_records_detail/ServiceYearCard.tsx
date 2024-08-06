import { CardSection } from '../publisher_records/Wrappers';
import useAppTranslation from '@hooks/useAppTranslation';
import ScrollableTabs from '@components/scrollable_tabs';
import { useState } from 'react';
import { CustomTabProps } from '@components/tabs/index.types';
import { HorizontalFlex, VerticalFlex } from './index.styles';
import {
  AnnualReport,
  PersonMonthlyReport,
  PersonWithAnnualReport,
} from '../publisher_records/index.types';
import { IconCheck, IconClose } from '@components/icons';
import { MONTHS } from '@constants/index';
import { FieldServiceBadge } from '@pages/reports/field-service/PersonBadge';
import { Badge } from '@components/index';
import { BadgeColor } from '@definition/app';
import { Box } from '@mui/material';

const MediumBadge = ({ text, color }: { text: string; color?: BadgeColor }) => {
  return (
    <Badge
      text={text}
      color={color || 'grey'}
      size="medium"
      sx={{
        padding: '4px 8px !important',
        height: '26px',
        '> p': {
          fontSize: '14px !important',
          fontWeight: '520',
        },
      }}
      filled={false}
    />
  );
};

const TableRow = ({
  monthReport,
  monthName,
}: {
  monthReport: PersonMonthlyReport;
  monthName: string;
}) => {
  const { t } = useAppTranslation();

  return (
    <HorizontalFlex
      sx={{
        width: '100%',
        padding: '10px 8px',
        justifyContent: 'space-between',
        alignItems: 'center',
        '& + &': {
          borderTop: '1px solid var(--accent-200)',
        },
      }}
    >
      <VerticalFlex sx={{ gap: '4px' }}>
        <HorizontalFlex sx={{ gap: '8px' }}>
          {monthReport.sharedAnyFormOfTheMinistry ? (
            <IconCheck width={20} height={20} color="var(--accent-main)" />
          ) : (
            <IconClose width={20} height={20} color="var(--red-main)" />
          )}
          <span
            style={{ color: 'var(--grey-400)', fontWeight: '550' }}
            className="body-regular"
          >
            {t(monthName)}
          </span>
          {monthReport?.fieldService !== 'Publisher' && (
            <FieldServiceBadge fieldService={monthReport.fieldService} />
          )}
        </HorizontalFlex>
        {monthReport.comments && (
          <span
            style={{ color: 'var(--grey-350)' }}
            className="body-small-regular"
          >
            {monthReport.comments}
          </span>
        )}
      </VerticalFlex>
      <HorizontalFlex>
        {monthReport.bibleStudies && (
          <MediumBadge
            text={t('tr_bibleStudiesCount', {
              StudiesCount: monthReport.bibleStudies,
            })}
          />
        )}
        {monthReport.totalHours && (
          <MediumBadge
            text={t('tr_hoursList', {
              Hours: monthReport.totalHours,
            })}
          />
        )}
      </HorizontalFlex>
    </HorizontalFlex>
  );
};

const StatisticContent = ({ year }: { year: AnnualReport }) => {
  const { t } = useAppTranslation();

  return (
    <VerticalFlex>
      <VerticalFlex sx={{ gap: '0px' }}>
        {year.months.map((month, index) => (
          <TableRow
            key={index}
            monthReport={month}
            monthName={MONTHS[(index + 8) % 12]}
          />
        ))}
      </VerticalFlex>
      <HorizontalFlex
        sx={{
          backgroundColor: 'var(--accent-100)',
          borderRadius: 'var(--radius-m)',
          justifyContent: 'space-between',
          padding: '8px',
        }}
      >
        <span
          style={{ color: 'var(--accent-dark)', fontWeight: '570' }}
          className="h3"
        >
          {t('tr_total')}
        </span>
        <MediumBadge
          color="accent"
          text={t('tr_hoursList', {
            Hours: '85',
          })}
        />
      </HorizontalFlex>
    </VerticalFlex>
  );
};

const data: PersonWithAnnualReport = {
  id: '1',
  firstName: 'Alice',
  lastName: 'Adams',
  gender: 'female',
  fieldService: 'Publisher',
  serviceReports: [
    {
      year: 2021,
      months: [
        { sharedAnyFormOfTheMinistry: true },
        { sharedAnyFormOfTheMinistry: true },
        { sharedAnyFormOfTheMinistry: true },
        {
          fieldService: 'Auxiliary pioneer',
          sharedAnyFormOfTheMinistry: true,
          bibleStudies: 1,
          totalHours: 17,
          comments: 'Great month',
        },
        {
          fieldService: 'Publisher',
          sharedAnyFormOfTheMinistry: true,
          bibleStudies: 1,
          totalHours: 30,
        },
        { sharedAnyFormOfTheMinistry: false },
        { sharedAnyFormOfTheMinistry: false },
        {
          fieldService: 'Auxiliary pioneer',
          sharedAnyFormOfTheMinistry: true,
          bibleStudies: 1,
          totalHours: 30,
        },
        { sharedAnyFormOfTheMinistry: true },
        { sharedAnyFormOfTheMinistry: true },
        { sharedAnyFormOfTheMinistry: true },
        { sharedAnyFormOfTheMinistry: true },
        { sharedAnyFormOfTheMinistry: true },
      ],
    },
    {
      year: 2022,
      months: [
        { sharedAnyFormOfTheMinistry: true },
        {
          fieldService: 'Auxiliary pioneer',
          sharedAnyFormOfTheMinistry: true,
          bibleStudies: 1,
          totalHours: 17,
          comments: 'Was sick',
        },
        { sharedAnyFormOfTheMinistry: true },
        {
          fieldService: 'Publisher',
          sharedAnyFormOfTheMinistry: true,
          bibleStudies: 1,
          totalHours: 30,
        },
        { sharedAnyFormOfTheMinistry: true },
        { sharedAnyFormOfTheMinistry: false },
        { sharedAnyFormOfTheMinistry: false },
        { sharedAnyFormOfTheMinistry: true },
        { sharedAnyFormOfTheMinistry: false },
        {
          fieldService: 'Auxiliary pioneer',
          sharedAnyFormOfTheMinistry: true,
          bibleStudies: 1,
          totalHours: 40,
        },
        { sharedAnyFormOfTheMinistry: true },
        {
          fieldService: 'Auxiliary pioneer',
          sharedAnyFormOfTheMinistry: true,
          bibleStudies: 1,
          totalHours: 30,
        },
        { sharedAnyFormOfTheMinistry: false },
      ],
    },
  ],
};

const years: CustomTabProps['tabs'] = data.serviceReports.map((year) => ({
  label: year.year.toString(),
  Component: <StatisticContent year={year} />,
}));

const ServiceYearCard = () => {
  const [year, setYear] = useState(0);

  const { t } = useAppTranslation();

  return (
    <CardSection>
      <VerticalFlex>
        <span
          className="h2"
          style={{
            fontWeight: 570,
            display: 'block',
            color: 'var(--black)',
          }}
        >
          {t('tr_statistics')}
        </span>
        <Box
          sx={{
            // fix padding of the scrollable tabs content
            '> * > *:not(:nth-child(1)) > *': {
              paddingBottom: '0',
              marginBottom: '-8px',
              paddingTop: '8px',
            },
          }}
        >
          <ScrollableTabs tabs={years} value={year} onChange={setYear} />
        </Box>
      </VerticalFlex>
    </CardSection>
  );
};

export default ServiceYearCard;
