import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { orange } from '@mui/material/colors';
import ApartmentIcon from '@mui/icons-material/Apartment';
import Autocomplete from '@mui/material/Autocomplete';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import WarningIcon from '@mui/icons-material/Warning';
import maleIcon from '../img/student_male.svg';
import femaleIcon from '../img/student_female.svg';
import { ServiceYear } from '../classes/ServiceYear';
import { Persons } from '../classes/Persons';
import { S4 } from '../features/fieldServiceReport';
import { S21s } from '../classes/S21s';
import { refreshReportState } from '../states/report';
import { S1s } from '../classes/S1s';
import { FSGList } from '../classes/FSGList';

const FSGOptions = () => {
  let options = [];

  const FSGCurrent = FSGList.getCurrent();
  if (FSGCurrent) {
    for (const group of FSGCurrent.groups) {
      options.push(group.group_uid);
    }
  }

  return options;
};

const FieldServiceReport = () => {
  const { t } = useTranslation('ui');

  const refresh = useRecoilValue(refreshReportState);

  const [currentServiceYear, setCurrentServiceYear] = useState(
    ServiceYear.getByMonth(ServiceYear.currentReportMonth()).uid
  );
  const [currentMonth, setCurrentMonth] = useState('');
  const [allMonths, setAllMonths] = useState([]);
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('activePublishers');
  const [isLoading, setIsLoading] = useState(true);
  const [haveReports, setHaveReports] = useState(0);
  const [totalPublishers, setTotalPublishers] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentFSG, setCurrentFSG] = useState('');

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

  useEffect(() => {
    if (currentMonth && filter !== '') {
      setSelected(null);
      setOptions(Persons.filterAdvanced({ filter, month: currentMonth, fsg: currentFSG }));
    }
  }, [filter, currentMonth, currentFSG]);

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

  useEffect(() => {
    if (currentMonth) {
      setIsSubmitted(false);
      const currentReport = S1s.get(currentMonth);
      if (currentReport) {
        setIsSubmitted(currentReport.details.isSubmitted);
      }

      const persons = Persons.filterAdvanced({ filter: 'activePublishers', month: currentMonth });
      setTotalPublishers(persons.length);

      const reports = Persons.filterAdvanced({ filter: 'haveReports', month: currentMonth });
      setHaveReports(reports.length);
    }
  }, [currentMonth, refresh]);

  return (
    <Box sx={{ marginBottom: '30px' }}>
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

      {isSubmitted && (
        <Box
          sx={{
            maxWidth: '500px',
            borderRadius: '8px',
            padding: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <WarningIcon color="warning" />
          <Typography sx={{ fontSize: '15px', color: orange[900] }}>{t('reportAlreadySubmitted')}</Typography>
        </Box>
      )}

      {!isSubmitted && (
        <Box sx={{ marginTop: '20px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <ApartmentIcon color="primary" />
          <Link href="#/branch-office-reports" underline="none" sx={{ lineHeight: 1.2 }}>
            {t('prepareS1Report')}
          </Link>
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          gap: '3px',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '500px',
          margin: '20px 0',
        }}
      >
        <LinearProgress
          color="success"
          variant="determinate"
          value={totalPublishers === 0 ? 0 : (haveReports * 100) / totalPublishers}
          sx={{ width: '90px', flexGrow: 1 }}
        />
        <Typography sx={{ fontWeight: 'bold', marginLeft: '10px' }}>{`${haveReports}/${totalPublishers}`}</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap', maxWidth: '500px' }}>
        <TextField
          id="outlined-select-filter"
          select
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <MenuItem value="activePublishers">{t('activePublishers')}</MenuItem>
          <MenuItem value="fieldServiceGroup">{t('fieldServiceGroup')}</MenuItem>
          <MenuItem value="unbaptizedPublishers">{t('unbaptizedPublishers')}</MenuItem>
          <MenuItem value="baptizedPublishers">{t('baptizedPublishers')}</MenuItem>
          <MenuItem value="auxiliaryPioneers">{t('auxiliaryPioneers')}</MenuItem>
          <MenuItem value="regularPioneers">{t('regularPioneers')}</MenuItem>
          <MenuItem value="appointedBrothers">{t('appointedBrothers')}</MenuItem>
          <MenuItem value="unpostedReports">{t('unpostedReports')}</MenuItem>
          <Divider />
          <MenuItem value="inactivePublishers">{t('inactivePublishers')}</MenuItem>
        </TextField>
        {filter === 'fieldServiceGroup' && (
          <TextField
            id="outlined-select-field-service-group"
            select
            size="small"
            sx={{ width: '280px' }}
            value={currentFSG}
            onChange={(e) => setCurrentFSG(e.target.value)}
          >
            {FSGOptions().map((group, index) => (
              <MenuItem key={group} value={group}>
                {`${t('fieldServiceGroup')} ${index + 1}`}
              </MenuItem>
            ))}
          </TextField>
        )}
        <Autocomplete
          disablePortal
          id="combo-box-persons"
          size="small"
          noOptionsText={t('noOptions')}
          options={options}
          getOptionLabel={(option) => option.person_name}
          sx={{ width: 300 }}
          renderOption={(props, option) => (
            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
              <Avatar
                sx={{
                  height: '25px',
                  width: '25px',
                  marginRight: '5px',
                }}
                alt="Student icon"
                src={option.isMale ? maleIcon : femaleIcon}
              />
              {option.person_name}
            </Box>
          )}
          renderInput={(params) => {
            const selected = params.inputProps.value;
            const person = selected === '' ? undefined : Persons.getByName(selected);

            return (
              <TextField
                {...params}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: person ? (
                    <Avatar
                      sx={{
                        height: '25px',
                        width: '25px',
                        marginLeft: '5px',
                      }}
                      alt="Student icon"
                      src={person.isMale ? maleIcon : femaleIcon}
                    />
                  ) : null,
                }}
              />
            );
          }}
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
        <S4 serviceYear={currentServiceYear} month={currentMonth} person={selected.person_uid} isLocked={isSubmitted} />
      )}
    </Box>
  );
};

export default FieldServiceReport;
