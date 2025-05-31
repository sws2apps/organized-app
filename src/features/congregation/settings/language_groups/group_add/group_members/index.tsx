import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { GroupMembersProps } from './index.types';
import useGroupMembers from './useGroupMembers';
import Button from '@components/button';
import IconLoading from '@components/icon_loading';
import Typography from '@components/typography';
import LanguageGroupMembers from '../../group_members';

const GroupMembers = (props: GroupMembersProps) => {
  const { t } = useAppTranslation();

  const { handleCreateGroup, isProcessing } = useGroupMembers(props);

  return (
    <Stack spacing="24px" width="100%">
      <Typography color="var(--grey-400)">
        {t('tr_addNewLangGroupMembersDesc')}
      </Typography>

      <LanguageGroupMembers
        readOnly={isProcessing}
        onChange={props.onChange}
        group={props.group}
      />

      <Stack spacing="8px">
        <Button
          variant="main"
          onClick={handleCreateGroup}
          endIcon={isProcessing && <IconLoading />}
        >
          {t('tr_createGroup')}
        </Button>
        <Button variant="secondary" onClick={props.onClose}>
          {t('tr_cancel')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default GroupMembers;
