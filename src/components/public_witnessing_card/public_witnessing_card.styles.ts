import { styled } from '@mui/system';
import { ButtonBase } from '@mui/material';
import { ButtonBaseProps } from '@mui/material/ButtonBase/ButtonBase';
import { CustomAccordionVariant } from './public_witnessing_card.types';

export const StyledIconWrapper = styled(ButtonBase)<ButtonBaseProps>(
  (props) => ({
    borderRadius: 'var(--radius-l)',
    padding: '2.5px',
    color: props.color,
  })
);

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

export const colorVariants = {
  orange: 'var(--orange-dark)',
  dashed: 'var(--accent-400)',
  silver: 'var(--grey-300)',
  accent: 'var(--accent-dark)',
  disabled: 'var(--grey-300)',
};
export const CardWrapper = styled(ButtonBase)<
  ButtonBaseProps & { view: CustomAccordionVariant; hoverChildColor?: string }
>(({ view, hoverChildColor }) => ({
  minHeight: '48px',
  width: '100%',
  borderWidth: '1px',
  borderColor: borderViews[view],
  borderStyle: view === 'dashed' || view === 'silver' ? 'dashed' : 'solid',
  borderRadius: 'var(--radius-l)',
  padding: '10px',
  backgroundColor: bgColorView[view],
  pointerEvents: view === 'disabled' ? 'none' : null,
  '&:hover': {
    backgroundColor: hoverColorView[view],
    button: {
      backgroundColor: hoverChildColor,
    },
  },
  color: view === 'orange' ? 'var(--orange-main)' : 'var(--accent-dark)',
}));
