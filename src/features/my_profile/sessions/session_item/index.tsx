import { Box } from '@mui/material';
import {
  IconClock,
  IconClose,
  IconComputer,
  IconCopy,
  IconLocation,
  IconPhone,
} from '@components/icons';
import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import { SessionItemType } from './index.types';
import useSessionItem from './useSessionItem';
import Badge from '@components/badge';
import Button from '@components/button';
import Tooltip from '@components/tooltip';
import Typography from '@components/typography';

const shortenAddress = (value: string) => {
  if (value.length <= 24) return value;

  return `${value.slice(0, 12)}…${value.slice(-9)}`;
};

const SessionItem = (props: SessionItemType) => {
  const { t } = useAppTranslation();

  const {
    isProcessing,
    handleCopyAddress,
    handleTerminate,
    isCurrent,
    browser,
    lastSeen,
    country,
    ip,
  } = useSessionItem(props);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '8px 12px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
          flexGrow: 1,
          minWidth: 0,
          flexBasis: { mobile: '100%', tablet: 0 },
        }}
      >
        <Box
          sx={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-l)',
            backgroundColor: 'var(--accent-150)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {props.session.device.isMobile && (
            <IconPhone height={24} width={24} color="var(--accent-dark)" />
          )}
          {!props.session.device.isMobile && (
            <IconComputer height={24} width={24} color="var(--accent-dark)" />
          )}
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            minWidth: 0,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '8px',
            }}
          >
            <Typography className="body-small-semibold">{browser}</Typography>

            {isCurrent && (
              <Badge
                size="small"
                color="green"
                text={t('tr_currentSession')}
                className="body-small-regular"
              />
            )}
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '6px',
            }}
          >
            {country.length > 0 && (
              <Badge
                size="small"
                color="grey"
                text={country}
                icon={<IconLocation />}
                className="body-small-regular"
              />
            )}

            {lastSeen.length > 0 && (
              <Badge
                size="small"
                color="grey"
                text={lastSeen}
                icon={<IconClock />}
                className="body-small-regular"
              />
            )}

            <Tooltip title={ip} placement="top">
              <Box
                component="button"
                onClick={handleCopyAddress}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  height: '20px',
                  padding: '2px 6px',
                  cursor: 'pointer',
                  border: 'none',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--grey-150)',
                  color: 'var(--grey-400)',
                  '&:hover': { backgroundColor: 'var(--accent-200)' },
                  '& svg': { height: '14px', width: '14px' },
                  '& svg, & svg g, & svg g path': { fill: 'var(--grey-400)' },
                }}
              >
                <Typography className="body-small-regular" color="inherit">
                  {shortenAddress(ip)}
                </Typography>
                <IconCopy />
              </Box>
            </Tooltip>
          </Box>
        </Box>
      </Box>

      {!isCurrent && (
        <Button
          variant="small"
          color="red"
          disableAutoStretch
          minHeight={28}
          startIcon={isProcessing ? <IconLoading /> : <IconClose />}
          onClick={handleTerminate}
          sx={{ flexShrink: 0, marginLeft: 'auto' }}
        >
          {t('tr_terminate')}
        </Button>
      )}
    </Box>
  );
};

export default SessionItem;
