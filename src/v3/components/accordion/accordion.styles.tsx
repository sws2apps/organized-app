import { styled } from '@mui/material/styles';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { Stack } from '@mui/material';
import { IconExpand } from '@icons/index';
import MuiAccordionDetails, { AccordionDetailsProps } from '@mui/material/AccordionDetails';
import { AccordionViewProps } from './accordion.types';
import { colorVariants } from '@components/public_witnessing_card/public_witnessing_card.styles';

export const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(() => ({
  backgroundColor: 'inherit',
  color: 'inherit',
  width: '100%',
  '&.Mui-disabled': {
    backgroundColor: 'inherit',
  },
}));

export const AccordionSummary = styled((props: AccordionSummaryProps & AccordionViewProps) => (
  <MuiAccordionSummary
    expandIcon={
      props.view !== 'accent' && props.view !== 'disabled' ? (
        <Stack
          onClick={() => {
            props.onIconClick?.();
          }}
        >
          <IconExpand color={colorVariants[props.view] || colorVariants.dashed} />
        </Stack>
      ) : null
    }
    {...props}
  />
))((props) => ({
  flexDirection: 'row',
  padding: '0',
  minHeight: '26px',
  color: props.view === 'orange' ? 'var(--orange-main)' : 'var(--accent-dark)',
  '& .MuiAccordionSummary-content': {
    margin: '0 10px 0 0px',
    minWidth: '152px',
  },
  '&.Mui-disabled': {
    opacity: '1',
  },
}));

const colorBorder = {
  orange: 'var(--orange-main)',
  silver: 'var(--grey-200)',
  default: 'var(--accent-200)',
};

export const AccordionDetails = styled((props: AccordionDetailsProps & AccordionViewProps) => (
  <MuiAccordionDetails {...props} />
))((props) => ({
  padding: '8px 0 0 0',
  marginTop: '8px',
  borderTop: '1px solid',
  borderColor: colorBorder[props.view] || colorBorder.default,
}));
