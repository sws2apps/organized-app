import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { S1 } from '../features/branchReports';
import { ServiceYear } from '../classes/ServiceYear';

const BranchOfficeReports = () => {
  const { t } = useTranslation('ui');

  const [currentReport, setCurrentReport] = useState(null);
  const [options, setOptions] = useState([]);
  const [currentServiceYear, setCurrentServiceYear] = useState(
    ServiceYear.getByMonth(ServiceYear.currentReportMonth()).uid
  );
  const [allMonths, setAllMonths] = useState([]);
  const [currentMonth, setCurrentMonth] = useState('');

  const handleChangeReport = (value) => {
    setCurrentReport(value);
  };

  useEffect(() => {
    setOptions([{ report_type: 'S1Report', report_name: t('S1Report') }]);
  }, [t]);

  useEffect(() => {
    if (currentServiceYear !== '') {
      const options = ServiceYear.getMonths(currentServiceYear);
      setAllMonths(options);

      if (currentServiceYear === ServiceYear.getByMonth(ServiceYear.currentReportMonth()).uid) {
        let currentMonth;

        if (new Date().getDate() > 20) {
          currentMonth = new Date().getMonth();
        } else {
          currentMonth = new Date().getMonth() - 1;
        }
        if (currentMonth < 0) currentMonth = 0;
        const selected = options.find((option) => option.index === currentMonth);

        setCurrentMonth(selected.value);
      } else {
        setCurrentMonth(options[0].value);
      }
    }
  }, [currentServiceYear]);

  return (
    <Box sx={{ marginBottom: '30px' }}>
      <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '20px' }}>
        {t('branchOfficeReport')}
      </Typography>
      <Autocomplete
        disablePortal
        id="combo-box-persons"
        size="small"
        noOptionsText={t('noOptions')}
        options={options}
        getOptionLabel={(option) => option.report_name}
        isOptionEqualToValue={(option, value) => option.report_type === value.report_type}
        sx={{ minWidth: 300, maxWidth: 550 }}
        renderInput={(params) => <TextField {...params} label={t('selectReport')} />}
        value={currentReport}
        onChange={(e, newValue) => {
          handleChangeReport(newValue);
        }}
      />
      {currentReport !== null && (
        <Box sx={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <TextField
            id="outlined-select-service-year"
            select
            label={t('serviceYear')}
            size="small"
            sx={{ minWidth: '200px' }}
            value={currentServiceYear}
            onChange={(e) => setCurrentServiceYear(e.target.value)}
          >
            {ServiceYear.list.map((year) => (
              <MenuItem key={year.uid} value={year.uid}>
                {year.value}
              </MenuItem>
            ))}
          </TextField>
          {currentReport !== null && currentReport.report_type === 'S1Report' && (
            <TextField
              id="outlined-select-month"
              select
              label={t('selectMonth')}
              size="small"
              sx={{ minWidth: '250px' }}
              value={currentMonth}
              onChange={(e) => setCurrentMonth(e.target.value)}
            >
              {allMonths.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </TextField>
          )}
        </Box>
      )}
      <Divider sx={{ margin: '20px 0' }} />
      {currentReport !== null && currentReport.report_type === 'S1Report' && currentMonth !== '' && (
        <S1 serviceYear={currentServiceYear} month={currentMonth} />
      )}
    </Box>
  );
};

export default BranchOfficeReports;
