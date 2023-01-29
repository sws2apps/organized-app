import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Box from '@mui/material/Box';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Typography from '@mui/material/Typography';
import { yearsListState } from '../states/sourceMaterial';
import { SchedulesByYear } from '../features/schedules';
import { SourcesByYear } from '../features/sourceMaterial';

const PageAccordion = ({ page }) => {
  const { t } = useTranslation('ui');
  const yearsList = useRecoilValue(yearsListState);

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

  useEffect(() => {
    const list = localStorage.getItem(localStorageItem) ? JSON.parse(localStorage.getItem(localStorageItem)) : [];
    setYearsExpanded(list);
  }, [localStorageItem]);

  return (
    <Box sx={{ marginBottom: '60px' }}>
      <Typography sx={{ margin: '0px 0px 20px 0px', textTransform: 'uppercase', fontWeight: 'bold' }}>
        {page === 'schedule' ? t('schedule') : t('sourceMaterial')}
      </Typography>

      {yearsList.map((year) => (
        <Accordion key={year.value} onChange={handleChange(year.value)} expanded={yearsExpanded.includes(year.value)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {year.label}
            </Typography>
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
