import { Box, Grid } from '@mui/material';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useAssignments from './useAssignments';
import AssignmentGroup from '../assignment_group';
import Divider from '@components/divider';
import SwitchWithLabel from '@components/switch_with_label';
import Typography from '@components/typography';

const PersonAssignments = () => {
  const { t } = useAppTranslation();

  const { isPersonEditor } = useCurrentUser();

  const {
    assignments,
    checkedItems,
    classroomQualifications,
    handleToggleAssignment,
    handleToggleGroup,
    male,
    disqualified,
    autofillSkipped,
    handleToggleAutofillSkipped,
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
              classroomQualifications={classroomQualifications}
              male={male}
              disqualified={disqualified}
            />
          </Grid>
        ))}
      </Grid>

      <Divider color="var(--accent-200)" />

      <SwitchWithLabel
        label={t('tr_skipDuringAutofill')}
        helper={t('tr_skipDuringAutofillDesc')}
        checked={autofillSkipped}
        onChange={handleToggleAutofillSkipped}
        readOnly={!isPersonEditor || disqualified}
      />
    </Box>
  );
};

export default PersonAssignments;
