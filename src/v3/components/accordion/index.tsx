import { useState } from 'react';
import { CustomAccordionProps } from '@components/accordion/accordion.types';
import Typography from '@components/typography';
import { Accordion, AccordionDetails, AccordionSummary } from './accordion.styles';
import { colorVariants } from '@components/public_witnessing_card/public_witnessing_card.styles';

/**
 * CustomAccordion Component
 *
 * A customizable accordion component for React applications.
 *
 * @param {Object} props - Props for the CustomAccordion component.
 * @param {string} props.variant - The variant of the accordion. Defaults to 'accent'.
 * @param {string} props.label - The label displayed on the accordion header.
 * @param {Function} props.onClick - Function to be called when accordion header is clicked.
 * @param {Function} props.onChange - Function to be called when accordion state changes.
 * @param {React.ReactNode} props.children - Content of the accordion panel.
 * @param {boolean} props.disabled - Indicates whether the accordion is disabled.
 *
 * @returns {React.ReactElement} A React element representing the CustomAccordion component.
 */
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
