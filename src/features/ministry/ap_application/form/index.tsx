import { Stack } from '@mui/material';
import FormBody from './body';
import FormFooter from './footer';

const APApplicationForm = () => {
  return (
    <Stack spacing="24px">
      <FormBody />
      <FormFooter />
    </Stack>
  );
};

export default APApplicationForm;
