import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from '@mui/material';
import { CardSection } from './Wrappers';
import useAppTranslation from '@hooks/useAppTranslation';
import { HorizontalFlex, VerticalFlex } from './index.styles';
import ScrollableTabs from '@components/scrollable_tabs';
import { MenuItem, Switch, TextField } from '@components/index';
import { useState } from 'react';
import { MONTHS } from '@constants/index';
import { CustomTabProps } from '@components/tabs/index.types';
import { IconExpand } from '@components/icons';

const years: CustomTabProps['tabs'] = [
  { label: '2016', Component: null },
  { label: '2017', Component: null },
  { label: '2018', Component: null },
  { label: '2019', Component: null },
  { label: '2020', Component: null },
  { label: '2022', Component: null },
  { label: '2023', Component: null },
  { label: '2024', Component: null },
];

const TableHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        marginTop: '16px',
        marginBottom: '8px',
        background: 'var(--accent-150)',
        color: 'var(--accent-dark)',
        padding: '4px 8px 4px 8px',
        borderRadius: 'var(--radius-s)',
      }}
    >
      {children}
    </Box>
  );
};

const TableRow = ({
  label,
  value,
}: {
  label: string | React.ReactNode;
  value: string;
}) => {
  const formattedValue = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return (
    <HorizontalFlex
      sx={{
        width: '100%',
        padding: '10px 8px',
        justifyContent: 'space-between',
        '& + &': {
          borderTop: '1px solid var(--accent-200)',
        },
      }}
    >
      <span style={{ color: 'var(--grey-400)' }} className="body-regular">
        {label}
      </span>
      <span style={{ color: 'var(--grey-400)' }} className="h4">
        {formattedValue}
      </span>
    </HorizontalFlex>
  );
};

const TableRowExpandable = ({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) => {
  return (
    <Accordion
      elevation={0}
      sx={{
        margin: '0px !important',
        backgroundColor: 'var(--white)',
        '&::before': {
          content: 'unset',
        },
      }}
    >
      <AccordionSummary
        sx={{
          padding: '0 !important',
          minHeight: 'unset !important',
          '.MuiAccordionSummary-content': {
            margin: '0 !important',
          },
        }}
      >
        <TableRow
          label={
            <HorizontalFlex sx={{ gap: '8px' }}>
              {label}
              <IconExpand
                color="var(--black)"
                width={20}
                height={20}
                sx={{
                  '.Mui-expanded &': {
                    transform: 'rotate(180deg)',
                  },
                  transition: '150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                }}
              />
            </HorizontalFlex>
          }
          value={value}
        />
      </AccordionSummary>
      <AccordionDetails
        sx={{
          padding: '0 0 8px 0 !important',
          '> *:first-child ': {
            borderTop: '1px solid var(--accent-200)',
          },
          '> *': {
            paddingLeft: '24px',
          },
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

const StatisticPanel = () => {
  const { t } = useAppTranslation();

  const [year, setYear] = useState(0);
  const [month, setMonth] = useState<string>('');
  const [wholeYear, setWholeYear] = useState(false);

  return (
    <Box
      sx={{
        position: 'sticky',
        top: '72px',
      }}
    >
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
              // hide tabs content
              '> * > *:not(:first-child)': {
                display: 'none',
              },
            }}
          >
            <ScrollableTabs tabs={years} value={year} onChange={setYear} />
          </Box>
          <HorizontalFlex sx={{ gap: '24px' }}>
            <TextField
              label={t('tr_month')}
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              select
              disabled={wholeYear}
            >
              {MONTHS.map((month) => (
                <MenuItem key={month} value={month}>
                  {t(month)}
                </MenuItem>
              ))}
            </TextField>
            <HorizontalFlex sx={{ alignItems: 'center', flexShrink: '0' }}>
              <Switch
                id="wholeYear"
                checked={wholeYear}
                onChange={(e) => setWholeYear(e.target.checked)}
              />
              <label
                style={{ color: 'var(--black)', cursor: 'pointer' }}
                htmlFor="wholeYear"
              >
                {t('tr_wholeYearSetting')}
              </label>
            </HorizontalFlex>
          </HorizontalFlex>
          <VerticalFlex sx={{ gap: '0', marginTop: '-16px' }}>
            <TableHeader>{t('tr_fulltimeServants')}</TableHeader>
            <TableRow label={t('tr_totalCount')} value="17" />
            <TableRow label={t('tr_sharedInMinistry')} value="30" />
            <TableRow label={t('tr_didntSharedInMinistry')} value="17" />
            <TableRow label={t('tr_totalHours')} value="500" />
            <TableRow label={t('tr_bibleStudies')} value="34" />
            <TableHeader>{t('tr_APs')}</TableHeader>
            <TableRow label={t('tr_totalCount')} value="17" />
            <TableRow label={t('tr_sharedInMinistry')} value="16" />
            <TableRow label={t('tr_didntSharedInMinistry')} value="17" />
            <TableRow label={t('tr_totalHours')} value="17" />
            <TableRow label={t('tr_bibleStudies')} value="4" />
            <TableHeader>{t('tr_otherPublishers')}</TableHeader>
            <TableRow label={t('tr_totalCount')} value="17" />
            <TableRow label={t('tr_sharedInMinistry')} value="9" />
            <TableRow label={t('tr_didntSharedInMinistry')} value="17" />
            <TableRow label={t('tr_bibleStudies')} value="17" />
            <TableHeader>{t('tr_totalStats')}</TableHeader>
            <TableRowExpandable
              label={t('tr_publishersCountReport', { publishersCount: null })}
              value="17"
            >
              <TableRow label={t('tr_activePublishers')} value="5" />
              <TableRow label={t('tr_inactivePublishers')} value="17" />
              <TableRow label={t('tr_elders')} value="17" />
              <TableRow label={t('tr_ministerialServants')} value="17" />
              <TableRow label={t('tr_FRs')} value="37" />
              <TableRow label={t('tr_FSs')} value="7" />
              <TableRow label={t('tr_FMFs')} value="1" />
              <TableRow label={t('tr_auxiliaryPioneersContinuous')} value="5" />
              <TableRow label={t('tr_otherSheep')} value="17" />
              <TableRow label={t('tr_anointed')} value="17" />
              <TableRow label={t('tr_male')} value="17" />
              <TableRow label={t('tr_female')} value="17" />
            </TableRowExpandable>
            <TableRowExpandable label={t('tr_totalHours')} value="5520">
              <TableRow label={t('tr_activePublishers')} value="5520" />
            </TableRowExpandable>
            <TableRowExpandable label={t('tr_bibleStudies')} value="10">
              <TableRow label={t('tr_activePublishers')} value="10" />
            </TableRowExpandable>
          </VerticalFlex>
        </VerticalFlex>
      </CardSection>
    </Box>
  );
};

export default StatisticPanel;
