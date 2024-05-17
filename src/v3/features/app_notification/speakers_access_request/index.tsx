import { Stack } from '@mui/material';
import { IconCheckCircle, IconReject } from '@icons/index';
import { SpeakerAccessRequestType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import Button from '@components/button';
import Typography from '@components/typography';

const SpeakerAccessRequest = (props: SpeakerAccessRequestType) => {
  const { t } = useAppTranslation();

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
        <Typography className="h4">{props.cong_name}</Typography>
        <Typography color="var(--accent-400)" className="body-small-semibold">
          {props.cong_number}
        </Typography>
      </Stack>
      <Stack direction="row" alignItems="center">
        <Button
          sx={{ height: 'min-content' }}
          className={'body-small-semibold'}
          startIcon={<IconReject color={'red'} />}
          variant={'secondary'}
          color={'red'}
        >
          {t('tr_reject')}
        </Button>
        <Button
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
