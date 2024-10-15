import React, {
  Children,
  cloneElement,
  isValidElement,
  useState,
  useCallback,
  useEffect,
} from 'react';
import {
  StyledContentBox,
  HeaderBox,
  StyledTypography,
  ChildrenBox,
  StyledFormControlLabel,
  StyledCheckbox,
} from './assignments_checklist.styles';
import { type AssignmentCheckListProps } from './assignments_checklist.types';

/**
 * Component for rendering an assignment checklist.
 * @param {AssignmentCheckListProps} props - Props for the AssignmentCheckList component.
 * @returns {JSX.Element} AssignmentCheckList component.
 */
export const AssignmentCheckList = ({
  header,
  color,
  disabled = false,
  children,
  onChange,
  readOnly,
}: AssignmentCheckListProps) => {
  const [checkedItems, setCheckedItems] = useState({});
  const [checkedMain, setCheckedMain] = useState(false);

  const allChecked =
    Object.values(checkedItems).length > 0 &&
    Object.values(checkedItems).every((item) => item);
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

    onChange?.(newCheckedState);
  }, [allChecked, checkedMain, children, onChange]);

  const onChildCheckboxClick = (index) => {
    setCheckedItems({ ...checkedItems, [index]: !checkedItems[index] });
  };

  const renderChildren = () => {
    return Children.map(children, (child, index) => {
      if (isValidElement(child)) {
        return cloneElement(child, {
          //if child is disabled, keep the checked state. Otherwise, use the checkedItems state
          checked: child.props.disabled
            ? child.props.checked
            : checkedItems[index],
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
      Object.values(defaultValues).length > 0 &&
        Object.values(defaultValues).every((item) => item)
        ? true
        : false
    );
  }, [children]);

  return (
    <StyledContentBox>
      <HeaderBox
        sx={{ background: `var(--${color})`, minHeight: '32px' }}
        disabled={disabled}
      >
        <StyledFormControlLabel
          label={<StyledTypography>{header}</StyledTypography>}
          control={
            <StyledCheckbox
              disabled={disabled}
              checked={allChecked || checkedMain}
              indeterminate={someChecked && !allChecked}
              onChange={!readOnly ? onMainCheckboxClick : null}
              readOnly={readOnly}
            />
          }
        />
      </HeaderBox>
      <ChildrenBox>{renderChildren()}</ChildrenBox>
    </StyledContentBox>
  );
};

export default AssignmentCheckList;
