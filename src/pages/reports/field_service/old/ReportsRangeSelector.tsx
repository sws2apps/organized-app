import {
  CustomDivider,
  MenuItem,
  TextField,
  Typography,
} from '@components/index';
import { HorizontalFlex, StyledCardBox, VerticalFlex } from './index.styles';
import useAppTranslation from '@hooks/useAppTranslation';
import ProgressBar from '@components/progress_bar';
import { ListSubheader } from '@mui/material';
import { useState } from 'react';

const CustomListSubHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <ListSubheader
      className="body-small-semibold"
      sx={{
        color: 'var(--accent-dark)',
        font: 'inherit',
        padding: '16px 16px 8px 16px',
      }}
    >
      {children}
    </ListSubheader>
  );
};

const ReportsRangeSelector = () => {
  const { t } = useAppTranslation();

  const [month, setMonth] = useState<string>();
  const [year, setYear] = useState<string>();
  const [group, setGroup] = useState<string>();

  return (
    <StyledCardBox>
      <HorizontalFlex>
        <TextField
          select
          label={t('tr_serviceYear')}
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          <MenuItem value="2024">2024</MenuItem>
        </TextField>
        <TextField
          select
          label={t('tr_month')}
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          <MenuItem value="May">{t('tr_may')}</MenuItem>
        </TextField>
      </HorizontalFlex>
      <CustomDivider color="var(--accent-200)" />
      <VerticalFlex sx={{ gap: '8px' }}>
        <HorizontalFlex
          sx={{
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'var(--black)',
          }}
        >
          <span className="h3">{t('tr_receivedReports')}</span>
          <span className="body-small-regular">{t('tr_publishers')}</span>
        </HorizontalFlex>
        <ProgressBar value={12} maxValue={118} />
      </VerticalFlex>

      <TextField
        select
        defaultValue="all"
        value={group}
        onChange={(e) => setGroup(e.target.value)}
      >
        <CustomListSubHeader>{t('tr_publishers')}</CustomListSubHeader>
        <MenuItem value="activePub">{t('tr_activePublishers')}</MenuItem>
        <MenuItem value="inactivePub">{t('tr_inactivePublishers')}</MenuItem>
        <MenuItem value="unbaptizedPub">
          {t('tr_unbaptizedPublishers')}
        </MenuItem>
        <MenuItem value="baptizedPub">{t('tr_baptizedPublishers')}</MenuItem>
        <MenuItem value="notSub">{t('tr_reportNotSubmitted')}</MenuItem>
        <MenuItem value="all">{t('tr_allAppointedBrothers')}</MenuItem>
        <CustomListSubHeader>{t('tr_pioneers')}</CustomListSubHeader>
        <MenuItem value="aps">{t('tr_APs')}</MenuItem>
        <MenuItem value="frs">{t('tr_FRs')}</MenuItem>
        <CustomListSubHeader>{t('tr_fieldServiceGroups')}</CustomListSubHeader>
        <MenuItem value="group1">GROUP 1 – Sonsbeck</MenuItem>
        <MenuItem value="group2">GROUP 2 – New world</MenuItem>
        <MenuItem value="group3">GROUP 3 – A long name of the group</MenuItem>
        <MenuItem value="group4">GROUP 🐈 – Haja</MenuItem>
      </TextField>
    </StyledCardBox>
  );
};

export default ReportsRangeSelector;
