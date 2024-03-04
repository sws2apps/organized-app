import { styled } from '@mui/system';
import { ButtonBase } from '@mui/material';
import { ButtonBaseProps } from '@mui/material/ButtonBase/ButtonBase';
import { CPEAccordionVariant } from '@components/accordion/accordion.types';
export const StyledIconWrapper = styled(ButtonBase)({
  borderRadius: 'var(--radius-xl)',
  padding: '2.5px',
});

export const CardWrapper = styled(ButtonBase)<ButtonBaseProps & { view: CPEAccordionVariant }>(({ view }) => ({
  minHeight: '48px',
  width: '100%',
  border: `${view === 'searching' ? '1px var(--orange-dark)' : '1px var(--accent-300)'} `,
  borderStyle: `${view === 'dashed' ? 'dashed' : 'solid'}`,
  borderRadius: 'var(--radius-l)',
  padding: '10px',
  backgroundColor: view === 'searching' ? 'var(--orange-secondary)' : 'var(--accent-100)',
  '&.Mui-disabled': {
    backgroundColor: 'var(--grey-100)',
    border: '1px var(--grey-150)',
  },
  '&:hover': {
    backgroundColor: view === 'default' ? 'var(--accent-150)' : view === 'searching' ? 'var(--orange-tertiary)' : null,
  },
  color: view === 'searching' ? 'var(--orange-main)' : 'var(--accent-dark)',
}));
