import { styled } from '@mui/material/styles';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import MuiAccordionDetails, { AccordionDetailsProps } from '@mui/material/AccordionDetails';
import { useState } from 'react';
import { IconExpand } from '@components/icons';
import { CPEAccordionProps, CPEAccordionVariant } from '@components/accordion/accordion.types';
import Typography from '@components/typography';
import { ButtonBase } from '@mui/material';

interface AccordionViewProps {
  view: CPEAccordionVariant;
}

const Accordion = styled((props: AccordionProps & AccordionViewProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))((props) => ({
  border: `${props.view === 'searching' ? '1px var(--orange-dark)' : '1px var(--accent-300)'} `,
  borderStyle: `${props.view === 'dashed' ? 'dashed' : 'solid'}`,
  borderRadius: 'var(--radius-l)',
  padding: '10px',
  backgroundColor: props.view === 'searching' ? 'var(--orange-secondary)' : 'var(--accent-100)',
  '&.Mui-disabled': {
    backgroundColor: 'var(--grey-100)',
    border: '1px var(--grey-150)',
  },
  '&:hover': {
    backgroundColor: props.view === 'default' ? 'var(--accent-200)' : null,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps & AccordionViewProps) => (
  <MuiAccordionSummary
    expandIcon={
      props.view !== 'default' ? (
        <IconExpand color={props.view === 'searching' ? 'var(--orange-main)' : 'var(--accent-400)'} />
      ) : null
    }
    {...props}
  />
))((props) => ({
  flexDirection: 'row',
  padding: '0',
  minHeight: '28px',
  color: props.view === 'searching' ? 'var(--orange-main)' : 'var(--accent-dark)',
  '& .MuiAccordionSummary-content': {
    margin: '0 10px 0 0px',
    minWidth: '152px',
  },
}));

const AccordionDetails = styled((props: AccordionDetailsProps & AccordionViewProps) => (
  <MuiAccordionDetails {...props} />
))((props) => ({
  padding: '8px 0 0 0',
  marginTop: '8px',
  borderTop: '1px solid',
  borderColor: props.view === 'searching' ? 'var(--orange-main)' : 'var(--accent-200)',
  color: props.view === 'searching' ? 'var(--orange-dark)' : 'var(--accent-400)',
}));

const CPEAccordion = ({ variant = 'default', label, onClick, onChange, children, disabled }: CPEAccordionProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <ButtonBase component="div" style={{ borderRadius: 'var(--radius-l)' }} disabled={disabled}>
      <Accordion
        expanded={expanded}
        onChange={() => {
          onChange && onChange();
        }}
        view={variant}
        disabled={disabled}
      >
        <AccordionSummary
          view={variant}
          onClick={() => {
            onClick && onClick();
            children && setExpanded(!expanded);
          }}
        >
          <Typography
            className={'body-small-semibold'}
            color={
              disabled
                ? 'var(--grey-300)'
                : variant === 'searching'
                  ? 'var(--orange-dark)'
                  : variant === 'dashed'
                    ? 'var(--accent-400)'
                    : 'var(--accent-dark)'
            }
          >
            {label}
          </Typography>
        </AccordionSummary>
        <AccordionDetails view={variant}>{children}</AccordionDetails>
      </Accordion>
    </ButtonBase>
  );
};

export default CPEAccordion;
