import { Box, BoxProps } from '@mui/material';
import { KeyboardEvent } from 'react';
import { styled } from '@mui/system';

const StyledNavigationArrowButtonBase = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  padding: '4px',
  borderRadius: '50%',
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: 'var(--accent-150)',
  },
  '&:active': {
    backgroundColor: 'var(--accent-200)',
  },
}) as unknown as typeof Box;

type NavigationArrowButtonProps = BoxProps &
  React.AriaAttributes & {
    tabIndex?: number;
  };

const StyledNavigationArrowButton = ({
  onClick,
  tabIndex = 0,
  children,
  ...rest
}: NavigationArrowButtonProps) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick(e as never);
    }
  };

  return (
    <StyledNavigationArrowButtonBase
      role="button"
      tabIndex={tabIndex}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      {...(rest as BoxProps)}
    >
      {children}
    </StyledNavigationArrowButtonBase>
  );
};

export default StyledNavigationArrowButton;
