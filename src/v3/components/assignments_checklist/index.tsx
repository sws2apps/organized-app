import React, { Children, cloneElement, isValidElement, useState, useCallback, useEffect } from 'react';
import {
  StyledContentBox,
  HeaderBox,
  StyledTypography,
  ChildrenBox,
  StyledFormControlLabel,
  StyledCheckbox,
} from './assignments_checklist.styles';
import { type CPEAssignmentCheckListProps } from './assignments_checklist.types';

export const CPEAssignmentCheckList = ({ header, color, disabled = false, children }: CPEAssignmentCheckListProps) => {
  const [checkedItems, setCheckedItems] = useState({});
  const [checkedMain, setCheckedMain] = useState(false);

  useEffect(() => {
    //set default values
    const defaultValues = {};
    Children.forEach(children, (child, index) => {
      if (isValidElement(child)) {
        if (child.props.disabled) return; //skip if child checkbox is disabled
        defaultValues[index] = child.props.checked || false;
      }
    });
    setCheckedItems(defaultValues);
    setCheckedMain(
      Object.values(defaultValues).length > 0 && Object.values(defaultValues).every((item) => item) ? true : false
    );
  }, [children]);

  const allChecked = Object.values(checkedItems).length > 0 && Object.values(checkedItems).every((item) => item);
  const someChecked = Object.values(checkedItems).some((item) => item);

  const onMainCheckboxClick = useCallback(() => {
    const newCheckedState = allChecked ? !allChecked : !checkedMain;
    const newCheckedItems = {};
    Children.forEach(children, (child, index) => {
      if (isValidElement(child)) {
        if (child.props.disabled) return;
        newCheckedItems[index] = newCheckedState;
      }
    });

    setCheckedItems(newCheckedItems);
    setCheckedMain(newCheckedState);
  }, [allChecked, checkedMain, children]);

  const onChildCheckboxClick = (index) => {
    setCheckedItems({ ...checkedItems, [index]: !checkedItems[index] });
  };

  const renderChildren = () => {
    return Children.map(children, (child, index) => {
      if (isValidElement(child)) {
        return cloneElement(child, {
          //if child is disabled, keep the checked state. Otherwise, use the checkedItems state
          checked: child.props.disabled ? child.props.checked : checkedItems[index],
          onChange: (event, checked) => {
            onChildCheckboxClick(index);
            if (child.props.onChange) {
              child.props.onChange(event, checked);
            }
          },
        } as { checked: boolean });
      }
      return child;
    });
  };

  return (
    <StyledContentBox disabled={disabled}>
      <HeaderBox sx={{ background: `var(--${color})`, height: '32px' }}>
        <StyledFormControlLabel
          label={<StyledTypography>{header}</StyledTypography>}
          control={
            <StyledCheckbox
              disabled={disabled}
              checked={allChecked || checkedMain}
              indeterminate={someChecked && !allChecked}
              onChange={onMainCheckboxClick}
            />
          }
        />
      </HeaderBox>
      <ChildrenBox>{renderChildren()}</ChildrenBox>
    </StyledContentBox>
  );
};

export default CPEAssignmentCheckList;
