import { AssignmentGroupType } from './index.types';
import useAssignmentGroup from './useAssignmentGroup';
import AssignmentsCheckList from '@components/assignments_checklist';
import Checkbox from '@components/checkbox';
import ClassroomCheckbox from './classroom_checkbox';
import Tooltip from '@components/tooltip';

const AssignmentGroup = ({
  header,
  color,
  items,
  id,
  onHeaderChange,
  onItemChange,
  checkedItems,
  classroomQualifications,
  male,
  disqualified = false,
  readOnly,
  sx,
}: AssignmentGroupType) => {
  const {
    checkAssignmentDisabled,
    checkGroupDisabled,
    isMinistryDisabled,
    isDisabledByGender,
    getTooltipsForAssignmentTitles,
  } = useAssignmentGroup(male);

  return (
    <Tooltip
      followCursor
      title={getTooltipsForAssignmentTitles(id, items)}
      show={isMinistryDisabled(id, items) || isDisabledByGender(id)}
    >
      <AssignmentsCheckList
        sx={sx}
        header={header}
        color={color}
        disabled={
          disqualified ||
          checkGroupDisabled(id) ||
          isMinistryDisabled(id, items)
        }
        onChange={(checked) => onHeaderChange(checked, id)}
        readOnly={readOnly}
      >
        {items.map((assignment) => {
          const borderSx = assignment.borderTop
            ? {
                borderTop: '1px solid var(--accent-200)',
                marginTop: '4px',
                paddingTop: '8px',
              }
            : {};

          if (classroomQualifications?.codes.includes(assignment.code)) {
            return (
              <ClassroomCheckbox
                key={assignment.code}
                readOnly={readOnly}
                label={assignment.name}
                checked={
                  checkAssignmentDisabled(assignment.code)
                    ? false
                    : checkedItems.includes(assignment.code)
                }
                onChange={(_, checked) =>
                  onItemChange(checked, assignment.code)
                }
                disabled={
                  disqualified || checkAssignmentDisabled(assignment.code)
                }
                classrooms={classroomQualifications.classrooms}
                selected={classroomQualifications.getSelected(assignment.code)}
                onClassroomsChange={(classrooms) =>
                  classroomQualifications.onChange(assignment.code, classrooms)
                }
                sx={borderSx}
              />
            );
          }

          return (
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
              disabled={
                disqualified || checkAssignmentDisabled(assignment.code)
              }
              sx={borderSx}
            />
          );
        })}
      </AssignmentsCheckList>
    </Tooltip>
  );
};

export default AssignmentGroup;
