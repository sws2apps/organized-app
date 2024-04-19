import { Box } from '@mui/material';
import AssignmentGroup from '../assignment_group';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import useAssignments from './useAssignments';

const PersonAssignments = () => {
  const { t } = useAppTranslation();

  const { assignments, checkedItems, handleToggleAssignment, handleToggleGroup, isMale, isDiqualified } =
    useAssignments();

  return (
    <Box
      sx={{
        backgroundColor: 'var(--white)',
        border: '1px solid var(--accent-300)',
        display: 'flex',
        padding: '16px',
        gap: '16px',
        flexDirection: 'column',
        borderRadius: 'var(--radius-xl)',
      }}
    >
      <Typography className="h2">{t('tr_assignments')}</Typography>

      <Box sx={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {assignments.map((assignment) => (
          <AssignmentGroup
            key={assignment.id}
            id={assignment.id}
            header={assignment.header}
            color={assignment.color}
            items={assignment.items}
            onHeaderChange={handleToggleGroup}
            onItemChange={handleToggleAssignment}
            checkedItems={checkedItems}
            isMale={isMale}
            isDisqualified={isDiqualified}
          />
        ))}
      </Box>
    </Box>
  );
};

export default PersonAssignments;
