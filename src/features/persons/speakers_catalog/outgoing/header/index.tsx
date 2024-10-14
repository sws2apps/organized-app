import { Box, IconButton } from '@mui/material';
import {
  IconCheck,
  IconEdit,
  IconExpand,
  IconSharedWith,
} from '@components/icons';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { OutgoingSpeakersHeaderType } from './index.types';
import useHeader from './useHeader';
import Typography from '@components/typography';
import OutgoingSpeakersAccess from '../congregations_access';

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
    handleCloseAccess,
    handleOpenAccess,
    openAccess,
    congAccountConnected,
  } = useHeader();

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

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <Typography className="h2">{t('tr_yourCongregation')}</Typography>
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
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {isPublicTalkCoordinator && (
          <>
            <IconButton onClick={onEditModeChange}>
              {!editMode && <IconEdit color="var(--accent-main)" />}
              {editMode && <IconCheck color="var(--accent-main)" />}
            </IconButton>
            {congAccountConnected && (
              <IconButton onClick={handleOpenAccess}>
                <IconSharedWith color="var(--accent-main)" />
              </IconButton>
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
    </Box>
  );
};

export default OutgoingSpeakersHeader;
