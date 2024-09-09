import { Box } from '@mui/material';
import { IconInfo } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { GroupsContainer } from './index.styles';
import useFieldServiceGroups from './useFieldServiceGroups';
import GroupItem from './group_item';
import Typography from '@components/typography';

const FieldServiceGroupsContainer = () => {
  const { t } = useAppTranslation();

  const { desktopUp } = useBreakpoints();

  const { groups } = useFieldServiceGroups();

  return (
    <Box sx={{ flex: 1 }}>
      {groups.length === 0 && (
        <Box
          sx={{
            width: desktopUp ? '50%' : '100%',
            borderRadius: 'var(--radius-xl)',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'var(--white)',
            border: '1px solid var(--accent-300)',
          }}
        >
          <IconInfo color="var(--grey-350)" />
          <Typography color="var(--grey-350)">{t('tr_noGroupsYet')}</Typography>
        </Box>
      )}

      {groups.length > 0 && (
        <GroupsContainer spacing={2} sequential>
          {groups.map((group, index) => (
            <GroupItem key={group.group_id} group={group} index={index + 1} />
          ))}
        </GroupsContainer>
      )}
    </Box>
  );
};

export default FieldServiceGroupsContainer;
