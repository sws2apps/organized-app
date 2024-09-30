import { Stack } from '@mui/material';
import { ApplicationFormProps } from './index.types';
import FormBody from './body';

const ApplicationForm = (props: ApplicationFormProps) => {
  return <Stack>{props.application && <FormBody {...props} />}</Stack>;
};

export default ApplicationForm;
