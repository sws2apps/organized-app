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
import { SourcesByYear } from '../features/sourceMaterial';

const SourceMaterials = () => {
  const { t } = useTranslation();
  const yearsList = useRecoilValue(yearsListState);

  const [yearsExpanded, setYearsExpanded] = useState([]);

  const handleChange = (year) => (e, isExpanded) => {
    let newList = localStorage.getItem('source-materials') ? JSON.parse(localStorage.getItem('source-materials')) : [];
    newList = newList.filter((item) => item !== year);

    if (isExpanded) {
      newList.push(year);
    }

    setYearsExpanded(newList);
    localStorage.setItem('source-materials', JSON.stringify(newList));
  };

  useEffect(() => {
    const list = localStorage.getItem('source-materials') ? JSON.parse(localStorage.getItem('source-materials')) : [];
    setYearsExpanded(list);
  }, []);

  return (
    <Box>
      <Typography sx={{ margin: '0px 0px 20px 0px', textTransform: 'uppercase', fontWeight: 'bold' }}>
        {t('global.sourceMaterial')}
      </Typography>

      {yearsList.map((year) => (
        <Accordion key={year.value} onChange={handleChange(year.value)} expanded={yearsExpanded.includes(year.value)}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {year.label}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <SourcesByYear year={year.label} />
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default SourceMaterials;
