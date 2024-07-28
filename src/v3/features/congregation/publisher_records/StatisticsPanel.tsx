import { Box } from '@mui/material';
import { CardSection } from './Wrappers';
import useAppTranslation from '@hooks/useAppTranslation';
import { HorizontalFlex, VerticalFlex } from './index.styles';
import ScrollableTabs from '@components/scrollable_tabs';
import { MenuItem, Switch, TextField } from '@components/index';
import { useState } from 'react';
import { MONTHS } from '@constants/index';

const years: any[] = [
  { label: '2016', Component: <>ok</> },
  { label: '2017' },
  { label: '2018' },
  { label: '2019' },
  { label: '2020' },
  { label: '2022' },
  { label: '2023' },
  { label: '2024' },
];

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
        </VerticalFlex>
      </CardSection>
    </Box>
  );
};

export default StatisticPanel;
