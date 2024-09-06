import {
  AccordionDetails,
  AccordionSummary,
  Accordion as MUIAccordion,
} from '@mui/material';
import { IconExpand } from '@components/icons';
import { AccordionProps } from './index.types';
import Typography from '../typography';

const Accordion = ({
  onChange,
  detailsProps,
  summaryProps,
  label,
  id,
  children,
  ...props
}: AccordionProps) => {
  const handleChange = (panel: string) => (_, isExpanded: boolean) => {
    onChange(isExpanded ? panel : false);
  };

  return (
    <MUIAccordion
      onChange={handleChange(id)}
      sx={{
        boxShadow: 'none',
        backgroundColor: 'unset',
        '::before': { backgroundColor: 'unset' },
      }}
      {...props}
    >
      <AccordionSummary
        expandIcon={<IconExpand color="var(--black)" />}
        sx={{ '&.Mui-expanded': { minHeight: 'unset' }, padding: 'unset' }}
      >
        <Typography className="h4" {...summaryProps}>
          {label}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{ padding: 'unset', paddingTop: '8px' }}
        {...detailsProps}
      >
        {children}
      </AccordionDetails>
    </MUIAccordion>
  );
};

export default Accordion;
