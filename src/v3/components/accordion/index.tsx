import { useState } from 'react';
import { CustomAccordionProps } from '@components/accordion/accordion.types';
import Typography from '@components/typography';
import { Accordion, AccordionDetails, AccordionSummary } from './accordion.styles';
import { colorVariants } from '@components/public_witnessing_card/public_witnessing_card.styles';

const CustomAccordion = ({
  variant = 'accent',
  label,
  onClick,
  onChange,
  children,
  disabled,
}: CustomAccordionProps) => {
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
        <Typography className={'body-small-semibold'} color={colorVariants[variant]}>
          {label}
        </Typography>
      </AccordionSummary>
      <AccordionDetails view={variant}>{children}</AccordionDetails>
    </Accordion>
  );
};

export default CustomAccordion;
