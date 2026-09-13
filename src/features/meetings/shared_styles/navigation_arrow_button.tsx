import { Box, BoxProps } from '@mui/material';
import React, { KeyboardEvent } from 'react';
import { styled } from '@mui/system';

const StyledNavigationArrowButtonBase = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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

type NavigationArrowButtonProps = Omit<BoxProps, 'onClick'> &
  React.AriaAttributes & {
    tabIndex?: number;
    onClick?: () => void;
  };

const StyledNavigationArrowButton = ({
  onClick,
  tabIndex = 0,
  children,
  ...rest
}: NavigationArrowButtonProps) => {
  const isDisabled =
    rest['aria-disabled'] === true || rest['aria-disabled'] === 'true';

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (isDisabled) return;
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <StyledNavigationArrowButtonBase
      role="button"
      tabIndex={isDisabled ? -1 : tabIndex}
      onClick={isDisabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      {...(rest as BoxProps)}
    >
      {children}
    </StyledNavigationArrowButtonBase>
  );
};

export default StyledNavigationArrowButton;
