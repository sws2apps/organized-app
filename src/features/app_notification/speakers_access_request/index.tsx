import { Stack } from '@mui/material';
import { IconCheckCircle, IconReject } from '@icons/index';
import { SpeakerAccessRequestType } from './index.types';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useSpeakerAccessRequest from './useSpeakerAccessRequest';
import Button from '@components/button';
import Typography from '@components/typography';

const SpeakerAccessRequest = ({ request }: SpeakerAccessRequestType) => {
  const { t } = useAppTranslation();

  const { tabletDown } = useBreakpoints();

  const { handleAcceptRequest, handleRejectRequest } = useSpeakerAccessRequest(
    request.request_id
  );

  return (
    <Stack
      justifyContent="space-between"
      alignItems={tabletDown ? 'flex-start' : 'center'}
      sx={{
        backgroundColor: 'var(--accent-150)',
        border: '1px solid var(--accent-300)',
        padding: '8px',
        borderRadius: 'var(--radius-l)',
        flexDirection: { mobile: 'column', tablet: 'row' },
      }}
    >
      <Typography className="h4">
        ({request.country_code}) {request.cong_name}
      </Typography>
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
