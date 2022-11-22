import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { PersonAssignmentItem } from './';

const PersonAssignments = ({ student, assignments, setAssignments }) => {
  const { t } = useTranslation();

  const handleAssignmentAdd = () => {
    const obj = {
      assignmentId: window.crypto.randomUUID(),
      code: 100,
      startDate: format(new Date(), 'MM/dd/yyyy'),
      endDate: null,
      comments: '',
    };

    setAssignments([obj, ...assignments]);
  };

  return (
    <Box id="assignments-container">
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          marginBottom: '10px',
        }}
      >
        <Button variant="outlined" color="success" startIcon={<AddCircleIcon />} onClick={handleAssignmentAdd}>
          {t('persons.addAssignment')}
        </Button>
      </Box>
      {assignments?.length > 0 &&
        assignments.map((assignment) => (
          <PersonAssignmentItem
            key={assignment.assignmentId}
            student={student}
            assignment={assignment}
            assignments={assignments}
            setAssignments={(value) => setAssignments(value)}
          />
        ))}
    </Box>
  );
};

export default PersonAssignments;
