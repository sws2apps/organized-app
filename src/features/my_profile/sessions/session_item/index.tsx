import { Box } from '@mui/material';
import { IconClose, IconComputer, IconPhone } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { SessionItemType } from './index.types';
import useSessionItem from './useSessionItem';
import Button from '@components/button';
import Typography from '@components/typography';
import WaitingLoader from '@components/waiting_loader';

const SessionItem = (props: SessionItemType) => {
  const { t } = useAppTranslation();

  const {
    isProcessing,
    handleTerminate,
    isCurrent,
    browser,
    lastSeen,
    location,
  } = useSessionItem(props);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{
          padding: '8px',
          borderRadius: 'var(--radius-l)',
          backgroundColor: 'var(--accent-150)',
          display: 'flex',
          boxSizing: 'content-box',
        }}
      >
        {props.session.device.isMobile && (
          <IconPhone height={40} width={40} color="var(--accent-dark)" />
        )}
        {!props.session.device.isMobile && (
          <IconComputer height={40} width={40} color="var(--accent-dark)" />
        )}
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          flexGrow: 1,
        }}
      >
        <Typography className="body-small-regular" color="var(--accent-400)">
          {location}
        </Typography>
        <Typography className="body-small-regular" color="var(--accent-400)">
          {browser}
        </Typography>
        <Typography className="body-small-regular" color="var(--accent-400)">
          {lastSeen}
        </Typography>
      </Box>
      <Button
        variant="secondary"
        color={isCurrent ? 'green' : 'red'}
        startIcon={
          isCurrent ? null : isProcessing ? (
            <WaitingLoader size={22} variant="standard" />
          ) : (
            <IconClose />
          )
        }
        onClick={isCurrent ? null : handleTerminate}
      >
        {isCurrent ? t('tr_currentSession') : t('tr_terminate')}
      </Button>
    </Box>
  );
};

export default SessionItem;
