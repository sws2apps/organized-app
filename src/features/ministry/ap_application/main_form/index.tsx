import { Stack } from '@mui/material';
import useMainForm from './useMainForm';
import ApplicationForm from '@features/ministry/application_form';
import FormHeader from '../form_header';

const UserApplicationForm = () => {
  const { formData, handleFormChange, applications } = useMainForm();

  return (
    <Stack spacing="24px">
      {applications.length > 0 && <FormHeader applications={applications} />}
      <ApplicationForm application={formData} onChange={handleFormChange} />
    </Stack>
  );
};

export default UserApplicationForm;
