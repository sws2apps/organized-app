import { Box, Grid2 as Grid } from '@mui/material';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useAssignments from './useAssignments';
import AssignmentGroup from '../assignment_group';
import Typography from '@components/typography';

const PersonAssignments = () => {
  const { t } = useAppTranslation();

  const { isPersonEditor } = useCurrentUser();

  const {
    assignments,
    checkedItems,
    handleToggleAssignment,
    handleToggleGroup,
    male,
    disqualified,
  } = useAssignments();

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

      <Grid container spacing={2}>
        {assignments.map((assignment) => (
          <Grid key={assignment.id} size={{ mobile: 12, laptop: 6 }}>
            <AssignmentGroup
              sx={{ width: '100%' }}
              key={assignment.id}
              readOnly={!isPersonEditor}
              id={assignment.id}
              header={assignment.header}
              color={assignment.color}
              items={assignment.items}
              onHeaderChange={handleToggleGroup}
              onItemChange={handleToggleAssignment}
              checkedItems={checkedItems}
              male={male}
              disqualified={disqualified}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PersonAssignments;
