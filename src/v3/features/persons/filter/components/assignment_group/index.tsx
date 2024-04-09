import AssignmentsCheckList from '@components/assignments_checklist';
import Checkbox from '@components/checkbox';
import { AssignmentGroupType } from './index.types';
import useAssignmentGroup from './useAssignmentGroup';

const AssignmentGroup = ({ header, color, items, onChange, id }: AssignmentGroupType) => {
  const { filtersKey, handleToggleAssignment } = useAssignmentGroup();

  return (
    <AssignmentsCheckList header={header} color={color} onChange={(checked) => onChange(checked, id)}>
      {items.map((assignment) => (
        <Checkbox
          key={assignment.id}
          label={assignment.name}
          checked={filtersKey.includes(assignment.id)}
          onChange={() => handleToggleAssignment(assignment.id)}
          className="body-small-regular"
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
