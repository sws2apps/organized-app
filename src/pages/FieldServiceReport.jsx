import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ServiceYear } from '../classes/ServiceYear';
import { Persons } from '../classes/Persons';
import { S4 } from '../features/fieldServiceReport';
import { S21s } from '../classes/S21s';

const FieldServiceReport = () => {
  const { t } = useTranslation('ui');

  const [currentServiceYear, setCurrentServiceYear] = useState(ServiceYear.getCurrent().uid);
  const [currentMonth, setCurrentMonth] = useState('');
  const [allMonths, setAllMonths] = useState([]);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('allPublishers');
  const [isLoading, setIsLoading] = useState(true);

  const handleServiceYearChange = (value) => {
    setIsLoading(true);
    setCurrentServiceYear(value);
  };

  const handleMonthChange = (value) => {
    setIsLoading(true);
    setCurrentMonth(value);
  };

  const handlePersonChange = (value) => {
    setIsLoading(true);
    setSelected(value);
  };

  useEffect(() => {
    if (currentServiceYear !== '') {
      setSelected(null);

      const options = ServiceYear.getMonths(currentServiceYear);
      setAllMonths(options);

      if (currentServiceYear === ServiceYear.getCurrent().uid) {
        let currentMonth = new Date().getMonth() - 1;
        if (currentMonth < 0) currentMonth = 0;
        const selected = options.find((option) => option.index === currentMonth);

        setCurrentMonth(selected.value);
      } else {
        setCurrentMonth(options[0].value);
      }
    }
  }, [currentServiceYear]);

  useEffect(() => {
    if (currentMonth && filter !== '') {
      setSelected(null);
      setOptions(Persons.filterSecretary({ filter, month: currentMonth }));
    }
  }, [filter, currentMonth]);

  useEffect(() => {
    let fetchTimer;

    const handleInitialize = async () => {
      let currentS21 = S21s.get(currentServiceYear, selected.person_uid);
      if (!currentS21) {
        currentS21 = await S21s.add(currentServiceYear, selected.person_uid);
      }

      await currentS21.initializeMonth(currentMonth);

      setIsLoading(false);
    };

    if (selected === null) {
      setIsLoading(false);
      return;
    }

    if (selected !== null) {
      setIsLoading(true);
      fetchTimer = setTimeout(() => {
        handleInitialize();
      }, 1000);
    }

    return () => {
      if (fetchTimer) clearTimeout(fetchTimer);
    };
  }, [currentServiceYear, currentMonth, selected]);

  return (
    <Box>
      <Typography sx={{ textTransform: 'uppercase', fontWeight: 'bold', marginBottom: '20px' }}>
        {t('fieldServiceReport')}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap', marginBottom: '15px' }}>
        <TextField
          id="outlined-select-service-year"
          select
          label={t('serviceYear')}
          size="small"
          sx={{ minWidth: '200px' }}
          value={currentServiceYear}
          onChange={(e) => handleServiceYearChange(e.target.value)}
        >
          {ServiceYear.list.map((year) => (
            <MenuItem key={year.uid} value={year.uid}>
              {year.value}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="outlined-select-month"
          select
          label={t('selectMonth')}
          size="small"
          sx={{ minWidth: '250px' }}
          value={currentMonth}
          onChange={(e) => handleMonthChange(e.target.value)}
        >
          {allMonths.map((month) => (
            <MenuItem key={month.value} value={month.value}>
              {month.label}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
        <TextField
          id="outlined-select-service"
          select
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <MenuItem value="allPublishers">{t('allPublishers')}</MenuItem>
          <MenuItem value="unbaptizedPublishers">{t('unbaptizedPublishers')}</MenuItem>
          <MenuItem value="baptizedPublishers">{t('baptizedPublishers')}</MenuItem>
          <MenuItem value="appointedBrothers">{t('appointedBrothers')}</MenuItem>
        </TextField>
        <Autocomplete
          disablePortal
          id="combo-box-persons"
          size="small"
          noOptionsText={t('noOptions')}
          options={options}
          getOptionLabel={(option) => option.person_name}
          sx={{ width: 300 }}
          renderInput={(params) => <TextField {...params} />}
          value={selected}
          onChange={(e, newValue) => {
            handlePersonChange(newValue);
          }}
        />
      </Box>
      <Divider sx={{ margin: '20px 0' }} />
      {isLoading && (
        <CircularProgress
          color="secondary"
          size={40}
          disableShrink={true}
          sx={{
            display: 'flex',
            margin: '50px auto',
          }}
        />
      )}
      {!isLoading && currentServiceYear !== '' && currentMonth !== '' && selected !== null && (
        <S4 serviceYear={currentServiceYear} month={currentMonth} person={selected.person_uid} />
      )}
    </Box>
  );
};

export default FieldServiceReport;
