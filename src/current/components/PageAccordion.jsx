import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { refreshWeeksListState } from '../states/sourceMaterial';
import { SchedulesByYear } from '../features/schedules';
import { SourcesByYear } from '../features/sourceMaterial';
import { Sources } from '../classes/Sources';

const iconButtonStyles = {
  borderRadius: '8px',
  '.MuiTouchRipple-ripple .MuiTouchRipple-child': {
    borderRadius: 0,
    backgroundColor: 'rgba(23, 32, 42, .3)',
  },
  border: '1px outset',
  marginLeft: '10px',
};

const PageAccordion = ({ page }) => {
  const { t } = useTranslation('ui');

  const setRefreshWeekList = useSetRecoilState(refreshWeeksListState);

  const [yearsExpanded, setYearsExpanded] = useState([]);

  const localStorageItem = page === 'schedule' ? 'schedules' : 'source-materials';

  const handleChange = (year) => (e, isExpanded) => {
    let newList = localStorage.getItem(localStorageItem) ? JSON.parse(localStorage.getItem(localStorageItem)) : [];
    newList = newList.filter((item) => item !== year);

    if (isExpanded) {
      newList.push(year);
    }

    setYearsExpanded(newList);
    localStorage.setItem(localStorageItem, JSON.stringify(newList));
  };

  const handleYearAscending = (e) => {
    e.stopPropagation();
    localStorage.setItem('monthSort', 'asc');
    setRefreshWeekList((prev) => {
      return !prev;
    });
  };

  const handleYearDescending = (e) => {
    e.stopPropagation();
    localStorage.setItem('monthSort', 'desc');
    setRefreshWeekList((prev) => {
      return !prev;
    });
  };

  useEffect(() => {
    const list = localStorage.getItem(localStorageItem) ? JSON.parse(localStorage.getItem(localStorageItem)) : [];
    setYearsExpanded(list);
  }, [localStorageItem]);

  return (
    <Box sx={{ marginBottom: '60px' }}>
      <Typography sx={{ margin: '0px 0px 20px 0px', textTransform: 'uppercase', fontWeight: 'bold' }}>
        {page === 'schedule' ? t('schedule') : t('sourceMaterial')}
      </Typography>

      {Sources.yearsList().map((year) => (
        <Accordion key={year.value} onChange={handleChange(year.value)} expanded={yearsExpanded.includes(year.value)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {year.label}
              </Typography>
              {yearsExpanded.includes(year.value) && (
                <Stack direction="row" spacing={1}>
                  <IconButton onClick={handleYearAscending} sx={iconButtonStyles}>
                    <ArrowUpwardIcon />
                  </IconButton>
                  <IconButton onClick={handleYearDescending} sx={iconButtonStyles}>
                    <ArrowDownwardIcon />
                  </IconButton>
                </Stack>
              )}
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            {page === 'schedule' && <SchedulesByYear year={year.label} />}
            {page === 'sourceMaterial' && <SourcesByYear year={year.label} />}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default PageAccordion;
