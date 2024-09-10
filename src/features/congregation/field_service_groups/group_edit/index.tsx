import { Box, Stack } from '@mui/material';
import { IconDelete } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { GroupEditProps } from './index.types';
import useGroupEdit from './useGroupEdit';
import Button from '@components/button';
import GroupMembers from '../group_members';
import TextField from '@components/textfield';
import Typography from '@components/typography';

const GroupEdit = (props: GroupEditProps) => {
  const { t } = useAppTranslation();

  const {
    name,
    handleNameChange,
    handleGroupUpdate,
    tmpGroup,
    handleSaveChanges,
  } = useGroupEdit(props);

  return (
    <>
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          justifyContent: 'space-between',
        }}
      >
        <Typography className="h2">
          {t('tr_groupNumber', { groupNumber: props.index })}
        </Typography>

        <Button
          variant="small"
          color="red"
          startIcon={<IconDelete />}
          onClick={props.onDelete}
          disableAutoStretch
          sx={{ minHeight: '32px', height: '32px' }}
        >
          {t('tr_delete')}
        </Button>
      </Box>

      <TextField
        label={t('tr_groupNameOptional')}
        value={name}
        onChange={(e) => handleNameChange(e.target.value)}
      />

      <GroupMembers group={tmpGroup} onChange={handleGroupUpdate} />

      <Stack spacing="8px" width="100%">
        <Button variant="main" onClick={handleSaveChanges}>
          {t('tr_save')}
        </Button>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>
      </Stack>
    </>
  );
};

export default GroupEdit;
