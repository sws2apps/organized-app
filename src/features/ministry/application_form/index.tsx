import { Stack } from '@mui/material';
import { ApplicationFormProps } from './index.types';
import FormBody from './body';

const ApplicationForm = ({ application, onChange }: ApplicationFormProps) => {
  return (
    <Stack>
      <FormBody
        application={application}
        onChange={(application) => onChange(application)}
      />
    </Stack>
  );
};

export default ApplicationForm;
