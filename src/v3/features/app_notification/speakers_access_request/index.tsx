import { Stack } from '@mui/material';
import { IconCheckCircle, IconReject } from '@icons/index';
import { SpeakerAccessRequestType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useSpeakerAccessRequest from './useSpeakerAccessRequest';
import Button from '@components/button';
import Typography from '@components/typography';

const SpeakerAccessRequest = ({ request }: SpeakerAccessRequestType) => {
  const { t } = useAppTranslation();

  const { handleAcceptRequest, handleRejectRequest } = useSpeakerAccessRequest(
    request.request_id
  );

  return (
    <Stack
      justifyContent="space-between"
      sx={{
        backgroundColor: 'var(--accent-150)',
        border: '1px solid var(--accent-300)',
        padding: '15px',
        borderRadius: 'var(--radius-l)',
        flexDirection: { mobile: 'column', tablet: 'row' },
      }}
    >
      <Stack direction="column" justifyContent="center" spacing={0.5}>
        <Typography className="h4">
          ({request.country_code}) {request.cong_name}
        </Typography>
        <Typography color="var(--accent-400)" className="body-small-semibold">
          {request.cong_number}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center">
        <Button
          onClick={handleRejectRequest}
          sx={{ height: 'min-content' }}
          className={'body-small-semibold'}
          startIcon={<IconReject color={'red'} />}
          variant={'secondary'}
          color={'red'}
        >
          {t('tr_reject')}
        </Button>
        <Button
          onClick={handleAcceptRequest}
          sx={{ height: 'min-content' }}
          className={'body-small-semibold'}
          startIcon={<IconCheckCircle color={'accent'} />}
          variant={'secondary'}
        >
          {t('tr_accept')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default SpeakerAccessRequest;
