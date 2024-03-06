import { styled } from '@mui/system';
import { ButtonBase } from '@mui/material';
import { ButtonBaseProps } from '@mui/material/ButtonBase/ButtonBase';
import { CPEAccordionVariant } from '@components/accordion/accordion.types';
export const StyledIconWrapper = styled(ButtonBase)({
  borderRadius: 'var(--radius-xl)',
  padding: '2.5px',
});

const borderViews = {
  orange: 'var(--orange-dark)',
  dashed: 'var(--accent-400)',
  silver: 'var(--grey-200)',
  disabled: 'var(--grey-200)',
  accent: 'var(--accent-main)',
};

const bgColorView = {
  orange: 'var(--orange-secondary)',
  dashed: 'var(--white)',
  silver: 'var(--white)',
  disabled: 'var(--grey-100)',
  accent: 'var(--white)',
};

const hoverColorView = {
  orange: 'var(--orange-tertiary)',
  dashed: 'transparent',
  silver: 'transparent',
  disabled: 'transparent',
  accent: 'var(--accent-150)',
};
export const CardWrapper = styled(ButtonBase)<ButtonBaseProps & { view: CPEAccordionVariant }>(({ view }) => ({
  minHeight: '48px',
  width: '100%',
  borderWidth: '1px',
  borderColor: borderViews[view],
  borderStyle: view === 'dashed' || view === 'silver' ? 'dashed' : 'solid',
  borderRadius: 'var(--radius-l)',
  padding: '10px',
  backgroundColor: bgColorView[view],
  pointerEvents: view === 'disabled' ? 'none' : null,
  // '&.Mui-disabled': {
  //   backgroundColor: 'var(--grey-100)',
  //   border: '1px solid var(--grey-200)',
  //   color: 'var(--grey-300)',
  // },
  '&:hover': {
    backgroundColor: hoverColorView[view],
  },
  color: view === 'orange' ? 'var(--orange-main)' : 'var(--accent-dark)',
}));
