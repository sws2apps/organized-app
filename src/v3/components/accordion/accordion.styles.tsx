import { styled } from '@mui/material/styles';
import MuiAccordion, { AccordionProps } from '@mui/material/Accordion';
import MuiAccordionSummary, { AccordionSummaryProps } from '@mui/material/AccordionSummary';
import { Stack } from '@mui/material';
import { IconExpand } from '@icons/index';
import MuiAccordionDetails, { AccordionDetailsProps } from '@mui/material/AccordionDetails';
import { AccordionViewProps } from './accordion.types';

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
          <IconExpand
            color={
              props.view === 'orange'
                ? 'var(--orange-main)'
                : props.view === 'silver'
                  ? 'var(--grey-300)'
                  : 'var(--accent-400)'
            }
          />
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

export const AccordionDetails = styled((props: AccordionDetailsProps & AccordionViewProps) => (
  <MuiAccordionDetails {...props} />
))((props) => ({
  padding: '8px 0 0 0',
  marginTop: '8px',
  borderTop: '1px solid',
  borderColor:
    props.view === 'orange' ? 'var(--orange-main)' : props.view === 'silver' ? 'var(--grey-200)' : 'var(--accent-200)',
  // color: props.view === 'orange' ? 'var(--orange-dark)' : 'var(--accent-400)',
}));
