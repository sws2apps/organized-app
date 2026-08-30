import { Box, IconButton } from '@mui/material';
import { IconDelete, IconEdit } from '@components/icons';
import { IncomingSpeakerRowEditType } from './index.types';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useEditRow from './useEditRow';
import Button from '@components/button';
import Typography from '@components/typography';

const IncomingSpeakerRowEdit = ({
  speaker,
  onEdit,
}: IncomingSpeakerRowEditType) => {
  const { t } = useAppTranslation();

  const { mobile400Down, tabletDown } = useBreakpoints();

  const { name, talks, handleDeleteSpeaker } = useEditRow(speaker);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px',
        width: '100%',
        minHeight: '36px',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: mobile400Down ? 'flex-start' : 'center',
          gap: '8px',
          flexDirection: mobile400Down ? 'column' : 'row',
        }}
      >
        <Typography
          className="body-small-regular"
          color={name.length === 0 ? 'var(--grey-350)' : 'var(--black)'}
          sx={{
            minWidth: mobile400Down ? 'unset' : '215px',
            width: mobile400Down ? 'unset' : '215px',
          }}
        >
          {name.length === 0 ? t('tr_speaker') : name}
        </Typography>
        <Typography className="body-small-semibold">{talks}</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {!tabletDown && (
          <Button
            variant="small"
            color="accent"
            onClick={() => onEdit(speaker.person_uid)}
            sx={{ height: 'unset', minHeight: '32px', padding: 0 }}
            startIcon={
              <IconEdit width={20} height={20} color="var(--accent-main)" />
            }
          >
            {t('tr_edit')}
          </Button>
        )}

        {tabletDown && (
          <IconButton
            sx={{ padding: 0 }}
            onClick={() => onEdit(speaker.person_uid)}
          >
            <IconEdit width={20} height={20} color="var(--accent-main)" />
          </IconButton>
        )}

        <IconButton sx={{ padding: 0 }} onClick={handleDeleteSpeaker}>
          <IconDelete width={20} height={20} color="var(--red-main)" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default IncomingSpeakerRowEdit;
