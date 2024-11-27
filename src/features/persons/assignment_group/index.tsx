import AssignmentsCheckList from '@components/assignments_checklist';
import Checkbox from '@components/checkbox';
import { AssignmentGroupType } from './index.types';
import useAssignmentGroup from './useAssignmentGroup';
import Tooltip from '@components/tooltip';
import { useAppTranslation } from '@hooks/index';

const AssignmentGroup = ({
  header,
  color,
  items,
  id,
  onHeaderChange,
  onItemChange,
  checkedItems,
  male,
  disqualified = false,
  readOnly,
}: AssignmentGroupType) => {
  const { checkAssignmentDisabled, checkGroupDisabled } =
    useAssignmentGroup(male);

  const { t } = useAppTranslation();

  const isMinistryDisabled: boolean =
    id == 'ministry' && checkAssignmentDisabled(items[0].code);

  const isDisabledByGender: boolean = !male && id != 'applyFieldMinistryPart';

  const getTooltipTitle = (): string => {
    if (isMinistryDisabled) {
      return t('tr_onlyAvailableForPioneers');
    } else if (isDisabledByGender) {
      return t('tr_appliesOnlyToBrothers');
    }

    return '';
  };

  return (
    <Tooltip
      followCursor
      title={getTooltipTitle()}
      show={isMinistryDisabled || isDisabledByGender}
    >
      <AssignmentsCheckList
        header={header}
        color={color}
        disabled={disqualified || checkGroupDisabled(id) || isMinistryDisabled}
        onChange={(checked) => onHeaderChange(checked, id)}
        readOnly={readOnly}
      >
        {items.map((assignment) => (
          <Checkbox
            key={assignment.code}
            readOnly={readOnly}
            label={assignment.name}
            checked={
              checkAssignmentDisabled(assignment.code)
                ? false
                : checkedItems.includes(assignment.code)
            }
            onChange={(_, checked) => onItemChange(checked, assignment.code)}
            className="body-small-regular"
            disabled={disqualified || checkAssignmentDisabled(assignment.code)}
            sx={
              assignment.borderTop
                ? {
                    borderTop: '1px solid var(--accent-200)',
                    marginTop: '4px',
                    paddingTop: '8px',
                  }
                : {}
            }
          />
        ))}
      </AssignmentsCheckList>
    </Tooltip>
  );
};

export default AssignmentGroup;
