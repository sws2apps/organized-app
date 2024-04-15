import { createContext, useContext } from 'react';
import { styled } from '@mui/material/styles';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';

const Accordion = styled((props) => <MuiAccordion disableGutters elevation={0} square {...props} />)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />} {...props} />
))(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, .05)' : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const DataContext = createContext('');

const AccordionExtended = ({ expanded, children, content_id, handleChange }) => {
  return (
    <DataContext.Provider value={content_id}>
      <Accordion expanded={expanded === content_id} onChange={handleChange(content_id)}>
        {children}
      </Accordion>
    </DataContext.Provider>
  );
};

const Summary = ({ children }) => {
  const contentId = useContext(DataContext);

  return (
    <AccordionSummary aria-controls={`${contentId}-content"`} id={`${contentId}-header"`}>
      {children}
    </AccordionSummary>
  );
};

const Details = ({ children }) => {
  return <AccordionDetails>{children}</AccordionDetails>;
};

AccordionExtended.Summary = Summary;
AccordionExtended.Details = Details;

export default AccordionExtended;
