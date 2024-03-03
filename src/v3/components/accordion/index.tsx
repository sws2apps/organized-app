import { useState } from 'react';
import { CPEAccordionProps } from '@components/accordion/accordion.types';
import Typography from '@components/typography';
import { Accordion, AccordionDetails, AccordionSummary } from './accordion.styles';

const CPEAccordion = ({ variant = 'default', label, onClick, onChange, children, disabled }: CPEAccordionProps) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  return (
    <Accordion
      expanded={expanded}
      onChange={() => {
        onChange && onChange();
      }}
      disabled={disabled}
    >
      <AccordionSummary
        view={variant}
        onIconClick={() => {
          children && setExpanded(!expanded);
        }}
        onClick={() => {
          onClick && onClick();
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
  );
};

export default CPEAccordion;
