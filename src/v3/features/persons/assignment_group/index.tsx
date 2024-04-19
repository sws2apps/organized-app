import AssignmentsCheckList from '@components/assignments_checklist';
import Checkbox from '@components/checkbox';
import { AssignmentGroupType } from './index.types';
import useAssignmentGroup from './useAssignmentGroup';

const AssignmentGroup = ({
  header,
  color,
  items,
  id,
  onHeaderChange,
  onItemChange,
  checkedItems,
  isMale,
}: AssignmentGroupType) => {
  const { checkAssignmentDisabled, checkGroupDisabled } = useAssignmentGroup(isMale);

  return (
    <AssignmentsCheckList
      header={header}
      color={color}
      disabled={checkGroupDisabled(id)}
      onChange={(checked) => onHeaderChange(checked, id)}
    >
      {items.map((assignment) => (
        <Checkbox
          key={assignment.code}
          label={assignment.name}
          checked={checkAssignmentDisabled(assignment.code) ? false : checkedItems.includes(assignment.code)}
          onChange={(_, checked) => onItemChange(checked, assignment.code)}
          className="body-small-regular"
          disabled={checkAssignmentDisabled(assignment.code)}
          sx={
            assignment.borderTop
              ? { borderTop: '1px solid var(--accent-200)', marginTop: '4px', paddingTop: '8px' }
              : {}
          }
        />
      ))}
    </AssignmentsCheckList>
  );
};

export default AssignmentGroup;
