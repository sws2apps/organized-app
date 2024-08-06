import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import { Link } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {
  DatePicker,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@components/index';
import CustomCheckbox from '@components/checkbox';
import MultiSelect from '@components/multi_select';
import { MONTHS } from '@constants/index';
import { useAppTranslation } from '@hooks/index';

interface APSFormProps {
  continuousServiceDesire: boolean;
  setContinuousServiceDesire: (value: boolean) => void;
}

const AuxiliaryPioneerForm: React.FC<APSFormProps> = ({
  continuousServiceDesire,
  setContinuousServiceDesire,
}) => {
  const { t } = useAppTranslation();
  const all_months = MONTHS.map((monthKey) => t(monthKey));

  const [hours, setHours] = useState('');
  const [selectedMonths, setSelectedMonths] = useState([]);
  const [applicantName, setApplicantName] = useState('');

  return (
    <>
      <Grid mobile={12} laptop={12}>
        <Typography className="h2">{t('tr_applicationAPS')}</Typography>
        <Typography className="body-regular" marginTop={2}>
          {t('tr_applicationAPSDesc')}
        </Typography>
      </Grid>
      <Grid mobile={12} tablet688={3} laptop={2}>
        <Select
          className="body-regular"
          label={t('tr_hoursGoal')}
          value={continuousServiceDesire ? '30' : hours}
          disabled={continuousServiceDesire}
          onChange={(e) => setHours(e.target.value)}
        >
          {['15', '30'].map((hours) => (
            <MenuItem key={hours} value={hours}>
              <Typography className="body-regular" color="var(--black)">
                {hours}
              </Typography>
            </MenuItem>
          ))}
        </Select>
      </Grid>
      <Grid mobile={12} tablet688={9} laptop={4}>
        <MultiSelect
          className="body-regular"
          label={t('tr_theMonthsOf')}
          options={all_months}
          value={continuousServiceDesire ? [] : selectedMonths}
          disabled={continuousServiceDesire}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setSelectedMonths(
              typeof e.target.value === 'string'
                ? e.target.value.split(',')
                : e.target.value
            );
          }}
        />
      </Grid>
      <Grid mobile={12} laptop={6} display="flex">
        <CustomCheckbox
          label={t('tr_continuousAPS')}
          checked={continuousServiceDesire}
          onChange={() => setContinuousServiceDesire(!continuousServiceDesire)}
          sx={{ paddingLeft: '7px' }}
        />
      </Grid>
      <Grid mobile={12}>
        <Typography className="body-regular" marginBottom={1}>
          <Trans i18nKey="tr_pioneerApplicationMoral">
            <Link
              href="https://www.jw.org/finder?wtlocale=E&docid=202013206"
              className="h4"
              color="var(--accent-dark)"
              underline="none"
              target="_blank"
            >
              link
            </Link>
          </Trans>
        </Typography>
      </Grid>
      <Grid mobile={12} tablet688={4} laptop={3}>
        <DatePicker
          label={t('tr_selectDate')}
          value={new Date()}
          onChange={(e) => console.log('date', e)}
        />
      </Grid>
      <Grid mobile={12} tablet688={8} laptop={9}>
        <TextField
          label={t('tr_nameAPSApplication')}
          height={48}
          value={applicantName}
          onChange={(e) => setApplicantName(e.target.value)}
        />
      </Grid>
    </>
  );
};

export default AuxiliaryPioneerForm;
