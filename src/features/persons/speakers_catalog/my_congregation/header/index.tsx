import { Box, IconButton } from '@mui/material';
import {
  IconCheck,
  IconEdit,
  IconExpand,
  IconSharedWith,
} from '@components/icons';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import { OutgoingSpeakersHeaderType } from './index.types';
import useHeader from './useHeader';
import Typography from '@components/typography';
import OutgoingSpeakersAccess from '../congregations_access';
import Tooltip from '@components/tooltip';

const OutgoingSpeakersHeader = ({
  expanded,
  onExpandChange,
  editMode,
  onEditModeChange,
}: OutgoingSpeakersHeaderType) => {
  const { t } = useAppTranslation();

  const { isPublicTalkCoordinator } = useCurrentUser();

  const {
    congName,
    congNumber,
    circuitNumber,
    handleCloseAccess,
    handleOpenAccess,
    openAccess,
    congAccountConnected,
  } = useHeader();

  const { tablet600Down } = useBreakpoints();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '16px',
      }}
    >
      {congAccountConnected && openAccess && (
        <OutgoingSpeakersAccess open={openAccess} onClose={handleCloseAccess} />
      )}

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          width: tablet600Down ? '100%' : 'auto',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography className="h2">{t('tr_yourCongregation')}</Typography>
          {tablet600Down && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isPublicTalkCoordinator && (
                <>
                  <Tooltip title={t('tr_edit')} delaySpeed="slow">
                    <IconButton onClick={onEditModeChange}>
                      {!editMode && <IconEdit color="var(--accent-main)" />}
                      {editMode && <IconCheck color="var(--accent-main)" />}
                    </IconButton>
                  </Tooltip>
                  {congAccountConnected && (
                    <Tooltip title={t('tr_whoHasAccess')} delaySpeed="slow">
                      <IconButton onClick={handleOpenAccess}>
                        <IconSharedWith color="var(--accent-main)" />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              )}

              <IconButton onClick={onExpandChange}>
                <IconExpand
                  color="var(--black)"
                  sx={{
                    transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s',
                  }}
                />
              </IconButton>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flexWrap: 'wrap',
          }}
        >
          <Typography className="h4" color="var(--grey-400)">
            {congName}
          </Typography>
          <Typography
            className="body-small-semibold"
            color="var(--grey-400)"
            sx={{
              borderRadius: 'var(--radius-s)',
              padding: '2px 8px',
              backgroundColor: 'var(--grey-150)',
            }}
          >
            {congNumber}
          </Typography>
          <Typography
            className="body-small-semibold"
            color="var(--grey-400)"
            sx={{
              borderRadius: 'var(--radius-s)',
              padding: '2px 8px',
              backgroundColor: 'var(--grey-150)',
            }}
          >
            {t('tr_circuit', { circuitNumber: circuitNumber })}
          </Typography>
        </Box>
      </Box>

      {!tablet600Down && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isPublicTalkCoordinator && (
            <>
              <Tooltip title={t('tr_edit')} delaySpeed="slow">
                <IconButton onClick={onEditModeChange}>
                  {!editMode && <IconEdit color="var(--accent-main)" />}
                  {editMode && <IconCheck color="var(--accent-main)" />}
                </IconButton>
              </Tooltip>
              {congAccountConnected && (
                <Tooltip title={t('tr_whoHasAccess')} delaySpeed="slow">
                  <IconButton onClick={handleOpenAccess}>
                    <IconSharedWith color="var(--accent-main)" />
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}

          <IconButton onClick={onExpandChange}>
            <IconExpand
              color="var(--black)"
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default OutgoingSpeakersHeader;
