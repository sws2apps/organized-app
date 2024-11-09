import { Button, Divider, Stack, Typography } from '@mui/material';
import { OpenInNew } from '@mui/icons-material';
import useAdminUser from './useAdminUser';
import useMigrate from '../hooks/useMigrate';
import ActionSteps from '../action_steps';

const AdminUser = () => {
  const { hasData } = useAdminUser();

  const { handleOpenApp } = useMigrate();

  return (
    <Stack spacing="12px">
      {!hasData && (
        <>
          <Typography>
            The Congregation Program for Everyone (CPE) has been rebranded to a
            new application called Organized, featuring new look and enhanced
            features. Since you do not have any data to be migrated, you can
            directly open the new Organized app.
          </Typography>

          <Button
            variant="contained"
            endIcon={<OpenInNew />}
            onClick={handleOpenApp}
          >
            Open Organized
          </Button>
        </>
      )}

      {hasData && (
        <>
          <Typography>
            The Congregation Program for Everyone (CPE) has been rebranded to a
            new application called Organized, featuring new look and enhanced
            features. As an administrator to the congregation account in CPE,
            you have to complete the steps below to migrate your current data
            into Organized.
          </Typography>

          <Typography color="red" sx={{ fontWeight: 'bold' }}>
            ⛔ If there are more than one administrator in your congregation,
            make sure these steps are only done by one person. If you use
            multiple devices, make sure to use the one that has the most recent
            data.
          </Typography>

          <Divider />

          <ActionSteps />
        </>
      )}
    </Stack>
  );
};

export default AdminUser;
