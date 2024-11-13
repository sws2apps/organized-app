import { OpenInNew } from '@mui/icons-material';
import { Button, Stack, Typography } from '@mui/material';
import useMigrate from '../hooks/useMigrate';

const StandardUser = () => {
  const { handleOpenApp } = useMigrate();

  return (
    <Stack spacing="12px">
      <Typography>
        The Congregation Program for Everyone (CPE) has been rebranded to a new
        application called Organized, featuring new look and enhanced features.
        No action is needed from your side. Simply wait for a notification from
        your congregation administrator on when to start using the new Organized
        app.
      </Typography>

      <Button
        variant="contained"
        endIcon={<OpenInNew />}
        onClick={handleOpenApp}
      >
        Open Organized
      </Button>
    </Stack>
  );
};

export default StandardUser;
