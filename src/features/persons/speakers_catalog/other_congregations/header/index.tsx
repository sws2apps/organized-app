import { Box, IconButton } from '@mui/material';
import {
  IconCheck,
  IconCloud,
  IconCloudOff,
  IconDelete,
  IconEdit,
  IconExpand,
} from '@components/icons';
import { useBreakpoints, useCurrentUser } from '@hooks/index';
import { IncomingCongregationHeaderType } from './index.types';
import useHeader from './useHeader';
import Typography from '@components/typography';

const IncomingCongregationHeader = ({
  expanded,
  onExpandChange,
  editMode,
  onEditModeChange,
  cong_name,
  cong_number,
  cong_synced,
  onDelete,
}: IncomingCongregationHeaderType) => {
  const { laptopDown } = useBreakpoints();

  const { isPublicTalkCoordinator } = useCurrentUser();

  const { handleHideDelete, handleShowDelete, showDelete } = useHeader();

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
      onMouseEnter={handleShowDelete}
      onMouseLeave={handleHideDelete}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: tablet600Down ? '100%' : 'auto',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {cong_synced && <IconCloud />}
          {!cong_synced && <IconCloudOff color="var(--grey-300)" />}

          <Typography className="h4" color="var(--grey-400)">
            {cong_name}
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
            {cong_number}
          </Typography>
        </Box>
        {tablet600Down && (
          <IconButton onClick={() => onExpandChange(cong_number)}>
            <IconExpand
              color="var(--black)"
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.3s',
              }}
            />
          </IconButton>
        )}
      </Box>

      {!tablet600Down && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isPublicTalkCoordinator && (
            <>
              {(laptopDown || showDelete) && (
                <IconButton onClick={onDelete}>
                  <IconDelete color="var(--red-main)" />
                </IconButton>
              )}

              <IconButton onClick={onEditModeChange}>
                {!editMode && <IconEdit color="var(--accent-main)" />}
                {editMode && <IconCheck color="var(--accent-main)" />}
              </IconButton>
            </>
          )}

          <IconButton onClick={() => onExpandChange(cong_number)}>
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

export default IncomingCongregationHeader;
