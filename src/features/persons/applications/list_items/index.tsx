import { Grid2 as Grid } from '@mui/material';
import { ListItemsProps } from './index.types';
import Application from '../application';

const ListItems = ({ applications }: ListItemsProps) => {
  return (
    <Grid container spacing={2}>
      {applications.map((application) => (
        <Application key={application.request_id} application={application} />
      ))}
    </Grid>
  );
};

export default ListItems;
