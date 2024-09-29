import { Grid } from '@mui/material';
import { ApplicationProps } from './index.types';
import useApplication from './useApplication';
import UserCard from '@components/user_card';
import Badge from '@components/badge';

const Application = (props: ApplicationProps) => {
  const { name, isFemale, submitted, handleOpen } = useApplication(props);

  return (
    <Grid item desktop={4} laptop={6} tablet={12} sx={{ width: '100%' }}>
      <UserCard
        type="person"
        name={name}
        female={isFemale}
        showArrow
        onClick={handleOpen}
      >
        <Badge text={submitted} color="grey" size="small" filled={false} />
      </UserCard>
    </Grid>
  );
};

export default Application;
