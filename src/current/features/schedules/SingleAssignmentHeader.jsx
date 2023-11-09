import Typography from '@mui/material/Typography';

const SingleAssignmentHeader = ({ assignmentHeader }) => {
  return (
    <Typography variant="body1" sx={{ fontWeight: 'bold', fontSize: 16, marginBottom: '5px' }}>
      {assignmentHeader}
    </Typography>
  );
};

export default SingleAssignmentHeader;
