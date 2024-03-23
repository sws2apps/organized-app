import React from 'react';
import { StyledContentBox, HeaderBox, StyledTypography, ChildrenBox, IconBox } from './assignments_checklist.styles';
import SubstractImg from '@assets/img/illustration_subtract.svg?component';
import { type CPEAssignmentCheckListProps } from './assignments_checklist.types';

export const CPEAssignmentCheckList = ({
  header,
  showIcon,
  color,
  disabled = false,
  children,
}: CPEAssignmentCheckListProps) => {
  return (
    <StyledContentBox disabled={disabled}>
      <HeaderBox sx={{ background: `var(--${color})`, height: '32px' }}>
        {showIcon && (
          <IconBox>
            <SubstractImg />
          </IconBox>
        )}
        <StyledTypography showIcon={showIcon}>{header}</StyledTypography>
      </HeaderBox>
      <ChildrenBox>{children}</ChildrenBox>
    </StyledContentBox>
  );
};

export default CPEAssignmentCheckList;
