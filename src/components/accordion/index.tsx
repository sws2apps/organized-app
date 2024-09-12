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
  summaryTextProps,
  sx,
  ...props
}: AccordionProps) => {
  const handleChange = (panel: string) => (_, isExpanded: boolean) => {
    onChange(isExpanded ? panel : false);
  };

  return (
    <MUIAccordion
      onChange={handleChange(id)}
      elevation={0}
      sx={{
        margin: '0px !important',
        boxShadow: 'none',
        backgroundColor: 'unset',
        '::before': { backgroundColor: 'unset', content: 'unset' },
        ...sx,
      }}
      {...props}
    >
      <AccordionSummary
        expandIcon={<IconExpand color="var(--black)" />}
        {...summaryProps}
        sx={{
          minHeight: 'unset !important',
          padding: 'unset',
          '&.Mui-expanded': { minHeight: 'unset' },
          '.MuiAccordionSummary-content': {
            margin: '10px 0 !important',
          },
          ...summaryProps?.sx,
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {typeof label === 'string' && (
          <Typography className="h4" {...summaryTextProps}>
            {label}
          </Typography>
        )}

        {typeof label !== 'string' && label}
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
