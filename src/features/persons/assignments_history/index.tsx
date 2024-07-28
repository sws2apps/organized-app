import { Box, Collapse, IconButton } from '@mui/material';
import { IconCollapse } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useAssignmentsHistory from './useAssignmentsHistory';
import Typography from '@components/typography';
import AssignmentsHistory from '@features/meetings/assignments_history';

const PersonAssignmentsHistory = () => {
  const { t } = useAppTranslation();

  const { expanded, handleToggleExpand, assignmentsHistory } =
    useAssignmentsHistory();

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
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography className="h2">{t('tr_assignmentsHistory')}</Typography>
        <IconButton sx={{ padding: 0 }} onClick={handleToggleExpand}>
          <IconCollapse
            color="var(--black)"
            sx={{
              transform: expanded ? 'rotate(0deg)' : 'rotate(180deg)',
              transition: 'transform 0.3s',
            }}
          />
        </IconButton>
      </Box>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <AssignmentsHistory history={assignmentsHistory} isDialog={false} />
      </Collapse>
    </Box>
  );
};

export default PersonAssignmentsHistory;
