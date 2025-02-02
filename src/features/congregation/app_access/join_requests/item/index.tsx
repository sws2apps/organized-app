import { Stack } from '@mui/material';
import { IconAccount, IconClose, IconLoading } from '@icons/index';
import { useAppTranslation } from '@hooks/index';
import { JoinRequestProps } from './index.types';
import useJoinRequest from './useJoinRequest';
import Button from '@components/button';
import Typography from '@components/typography';
import AcceptRequest from '../accept';

const JoinRequest = (props: JoinRequestProps) => {
  const { t } = useAppTranslation();

  const { type, request } = props;

  const {
    fullname,
    handleAcceptRequest,
    handleDeclineRequest,
    isProcessingAccept,
    isProcessingDecline,
  } = useJoinRequest(props);

  return (
    <Stack
      justifyContent="space-between"
      sx={{
        backgroundColor: type === 'page' ? 'var(--white)' : 'var(--accent-150)',
        border:
          type === 'page'
            ? '1px dashed var(--accent-300)'
            : '1px solid var(--accent-300)',
        padding: '8px 15px',
        borderRadius: 'var(--radius-l)',
        flexDirection: { mobile: 'column', tablet: 'row' },
      }}
    >
      <Stack direction="row" alignItems="center" spacing="8px">
        {type === 'page' && <IconAccount color="var(--black)" />}
        <Typography className="h4">{fullname}</Typography>
      </Stack>

      <Stack direction="row" alignItems="center">
        <Button
          sx={{ height: '32px', minHeight: '32px' }}
          className={'body-small-semibold'}
          startIcon={
            isProcessingDecline ? (
              <IconLoading color="red" />
            ) : (
              <IconClose color={'red'} />
            )
          }
          variant={'secondary'}
          color={'red'}
          onClick={handleDeclineRequest}
        >
          {t('tr_reject')}
        </Button>

        <AcceptRequest
          fullname={fullname}
          userId={request.user}
          isLoading={isProcessingAccept}
          onConfirm={handleAcceptRequest}
        />
      </Stack>
    </Stack>
  );
};

export default JoinRequest;
