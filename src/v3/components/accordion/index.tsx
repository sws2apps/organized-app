import { useState } from 'react';
import { CPEAccordionProps } from '@components/accordion/accordion.types';
import Typography from '@components/typography';
import { Accordion, AccordionDetails, AccordionSummary } from './accordion.styles';

const variantColors = {
  orange: 'var(--orange-dark)',
  dashed: 'var(--accent-400)',
  silver: 'var(--grey-300)',
  accent: 'var(--accent-dark)',
  disabled: 'var(--grey-300)',
};

const CPEAccordion = ({ variant = 'accent', label, onClick, onChange, children, disabled }: CPEAccordionProps) => {
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
          (variant === 'dashed' || variant === 'silver') && setExpanded(!expanded);
          variant !== 'dashed' && onClick && onClick();
        }}
      >
        <Typography className={'body-small-semibold'} color={variantColors[variant]}>
          {label}
        </Typography>
      </AccordionSummary>
      <AccordionDetails view={variant}>{children}</AccordionDetails>
    </Accordion>
  );
};

export default CPEAccordion;
