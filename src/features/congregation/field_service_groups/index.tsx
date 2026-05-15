import { Box } from '@mui/material';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import { GroupsContainer } from './index.styles';
import useFieldServiceGroups from './useFieldServiceGroups';
import GroupItem from './group_item';
import InfoNote from '@components/info_note';

const FieldServiceGroupsContainer = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const { isServiceCommittee } = useCurrentUser();

  const { masonry_columns, groups_list } = useFieldServiceGroups();

  return (
    <Box sx={{ flex: 1 }}>
      {groups_list.length === 0 && (
        <Box
          sx={{
            width: desktopUp ? '50%' : '100%',
            borderRadius: 'var(--radius-xl)',
            padding: '16px',
            backgroundColor: 'var(--white)',
            border: '1px solid var(--accent-300)',
          }}
        >
          <InfoNote
            message={
              isServiceCommittee
                ? t('tr_noGroupsYet')
                : t('tr_serviceGroupsListNone')
            }
          />
        </Box>
      )}

      {groups_list.length > 0 && (
        <Box sx={{ width: '100%' }}>
          <GroupsContainer columns={masonry_columns} spacing={2} sequential>
            {groups_list.map((record, index) => (
              <GroupItem
                key={record.group_id}
                group={record}
                index={index + 1}
                editable={!record.group_data.language_group}
              />
            ))}
          </GroupsContainer>
        </Box>
      )}
    </Box>
  );
};

export default FieldServiceGroupsContainer;
