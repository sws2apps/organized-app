import { Stack } from '@mui/material';
import useApplicationDetails from './useApplicationDetails';
import PageTitle from '@components/page_title';
import PersonApplication from '@features/persons/application_person';

const ApplicationDetails = () => {
  const { name } = useApplicationDetails();

  return (
    <Stack spacing="16px">
      <PageTitle title={name} />

      <PersonApplication />
    </Stack>
  );
};

export default ApplicationDetails;
