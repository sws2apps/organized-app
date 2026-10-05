import Card from '@components/card';
import { IBAnnouncementCardProps } from './index.types';
import { Box, Stack } from '@mui/material';
import Typography from '@components/typography';
import { formatDate } from '@utils/date';
import IconButton from '@components/icon_button';
import { IconDelete, IconEdit, IconPin, IconUnpin } from '@components/icons';
import useCurrentUser from '@hooks/useCurrentUser';
import { useAppTranslation } from '@hooks/index';
import DeleteAnnouncement from '../delete_announcement';
import useAnnouncementCard from './useAnnouncementCard';

const IBAnnouncementCard = (props: IBAnnouncementCardProps) => {
  const { t } = useAppTranslation();
  const { isAdmin } = useCurrentUser();
  const { deleteDialogOpen, handleOpenDeleteDialog, handleCloseDeleteDialog } =
    useAnnouncementCard();

  return (
    <>
      <DeleteAnnouncement
        open={deleteDialogOpen}
        title={props.title}
        onClose={handleCloseDeleteDialog}
        onConfirm={() => {
          handleCloseDeleteDialog();
          props.onDelete?.();
        }}
      />
      <Card width={'100%'} sx={{ breakInside: 'avoid', mb: '16px' }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Stack spacing="8px" sx={{ minWidth: 0 }}>
            <Stack
              direction="row"
              spacing="8px"
              alignItems="center"
              flexWrap="wrap"
            >
              <Typography
                className="h2"
                sx={{
                  minWidth: 0,
                  overflowWrap: 'anywhere',
                }}
              >
                {props.title}
              </Typography>

              {props.counter && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    px: '10px',
                    py: '2px',
                    backgroundColor: 'var(--accent-150)',
                    borderRadius: 'var(--radius-xxl)',
                  }}
                >
                  <Typography
                    className="label-small-medium"
                    color="var(--accent-dark)"
                  >
                    {props.counter}
                  </Typography>
                </Box>
              )}
            </Stack>

            {props.date && (
              <Typography
                className="body-small-regular"
                color="var(--grey-400)"
              >
                {formatDate(props.date, 'd MMMM yyyy')}
              </Typography>
            )}
          </Stack>

          <Stack alignItems="flex-end" spacing="8px" sx={{ flexShrink: 0 }}>
            {props.pinned && !props.onPin && (
              <Stack
                direction="row"
                spacing="4px"
                alignItems="center"
                sx={{ whiteSpace: 'nowrap' }}
              >
                <Typography
                  className="label-small-medium"
                  color="var(--grey-400)"
                >
                  {t('tr_pinned')}
                </Typography>
                <IconPin color="var(--grey-400)" />
              </Stack>
            )}

            {isAdmin && (
              <Stack direction="row" spacing="8px">
                {props.onEdit && (
                  <IconButton color="primary" onClick={props.onEdit}>
                    <IconEdit color="var(--accent-main)" />
                  </IconButton>
                )}
                {props.onPin && (
                  <IconButton color="primary" onClick={props.onPin}>
                    {props.pinned ? (
                      <IconUnpin color="var(--accent-main)" />
                    ) : (
                      <IconPin color="var(--accent-main)" />
                    )}
                  </IconButton>
                )}
                {props.onDelete && (
                  <IconButton color="error" onClick={handleOpenDeleteDialog}>
                    <IconDelete color="var(--red-main)" />
                  </IconButton>
                )}
              </Stack>
            )}
          </Stack>
        </Stack>

        {props.content}
      </Card>
    </>
  );
};

export default IBAnnouncementCard;
