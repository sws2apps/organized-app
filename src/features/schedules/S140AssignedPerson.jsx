import { Markup } from 'interweave';
import Typography from '@mui/material/Typography';

const S140AssignedPerson = ({ person }) => {
  return (
    <Typography sx={{ color: 'black', fontSize: '12px', padding: '0 0 0 8px', width: '180px', lineHeight: '20px' }}>
      <Markup content={person}></Markup>
    </Typography>
  );
};

export default S140AssignedPerson;
