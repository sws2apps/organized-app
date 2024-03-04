import { Box } from '@mui/material';
import { IconClose, IconComputer, IconLoading, IconPhone } from '@components/icons';
import { SessionResponseType } from '@definition/api';
import Button from '@components/button';
import Typography from '@components/typography';
import useSessionItem from './useSessionItem';

const SessionItem = (props: { session: SessionResponseType }) => {
  const { session } = props;

  const { isProcessing, handleTerminate, isCurrent, browser, lastSeen, location } = useSessionItem(session);

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'space-between' }}>
      <Box sx={{ padding: '8px' }}>
        {session.device.isMobile && <IconPhone height={40} width={40} color="var(--accent-dark)" />}
        {!session.device.isMobile && <IconComputer height={40} width={40} color="var(--accent-dark)" />}
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px', flexGrow: 1 }}>
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
        startIcon={isCurrent ? null : isProcessing ? <IconLoading /> : <IconClose />}
        onClick={isCurrent ? null : handleTerminate}
      >
        {isCurrent ? 'Current session' : 'Terminate'}
      </Button>
    </Box>
  );
};

export default SessionItem;
