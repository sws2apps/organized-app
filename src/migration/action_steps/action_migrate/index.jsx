import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import useActionMigrate from './useActionMigrate';

const ActionMigrate = () => {
  const { handleMigrate, isProcessing } = useActionMigrate();

  return (
    <Stack spacing="16px">
      <Typography>
        You are now ready to migrate your congregation data. Click the “Migrate
        now” to proceed.
      </Typography>

      <Button
        variant="contained"
        onClick={handleMigrate}
        endIcon={
          isProcessing ? <CircularProgress size={16} color="inherit" /> : null
        }
      >
        Migrate
      </Button>
    </Stack>
  );
};

export default ActionMigrate;
