import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useJoinRequests from './useJoinRequests';
import Divider from '@components/divider';
import JoinRequest from './item';
import Typography from '@components/typography';

const JoinRequests = () => {
  const { t } = useAppTranslation();

  const { requests } = useJoinRequests();

  if (requests.length === 0) return <></>;

  return (
    <>
      <Typography className="body-small-semibold">
        {t('tr_joinRequests')}
      </Typography>

      <Stack spacing="8px">
        {requests.map((request) => (
          <JoinRequest type="page" key={request.user} request={request} />
        ))}
      </Stack>

      <Divider color="var(--accent-200)" />
    </>
  );
};

export default JoinRequests;
