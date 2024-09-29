import { Grid } from '@mui/material';
import { ListItemsProps } from './index.types';
import Application from '../application';

const ListItems = ({ applications }: ListItemsProps) => {
  return (
    <Grid container spacing={2}>
      {applications.map((application) => (
        <Application key={application.person_uid} application={application} />
      ))}
    </Grid>
  );
};

export default ListItems;
