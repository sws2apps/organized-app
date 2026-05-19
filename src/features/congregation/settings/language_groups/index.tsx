import { Fragment } from 'react';
import { Box, Stack, Divider } from '@mui/material';
import { IconAdd, IconInfo } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import useLanguageGroups from './useLanguageGroups';
import GroupAdd from './group_add';
import LanguageGroup from './language_group';
import Typography from '@components/typography';
import Button from '@components/button';
import { GroupsContainer, GroupsHeader, TitleText } from './index.styles';

type LanguageGroupsProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

const LanguageGroups = ({ activeTab, onTabChange }: LanguageGroupsProps) => {
  const { t } = useAppTranslation();

  const {
    isAdd,
    handleCloseAdd,
    handleOpenAdd,
    languageGroups,
    fullAccess,
  } = useLanguageGroups();

  return (
    <Stack spacing="16px" sx={{ width: '100%' }}>
      {fullAccess && isAdd && (
        <GroupAdd open={isAdd} onClose={handleCloseAdd} />
      )}

      <GroupsContainer
        sx={{
          backgroundColor: languageGroups.length === 0 ? 'var(--accent-150)' : 'var(--white)',
          border: languageGroups.length === 0 ? '1px dashed var(--accent-300)' : '1px solid var(--accent-300)',
        }}
      >
        <GroupsHeader>
          <TitleText className="h3" color="var(--accent-400)">
            {t('tr_langGroups')}
          </TitleText>
          {fullAccess && (
            <Button
              variant="small"
              startIcon={<IconAdd />}
              onClick={handleOpenAdd}
            >
              {t('tr_add')}
            </Button>
          )}
        </GroupsHeader>

        {languageGroups.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {languageGroups.map((group, index) => (
              <Fragment key={group.group_id}>
                <LanguageGroup
                  group={group}
                  active={activeTab === `language-group-${group.group_id}`}
                  onClick={() => onTabChange(`language-group-${group.group_id}`)}
                />
                {index < languageGroups.length - 1 && (
                  <Divider sx={{ borderColor: 'var(--accent-200)' }} />
                )}
              </Fragment>
            ))}
          </Box>
        )}

        {languageGroups.length === 0 && (
          <Box sx={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
            <IconInfo color="var(--accent-400)" sx={{ flexShrink: 0 }} />
            <Typography color="var(--accent-400)" sx={{ wordBreak: 'break-word' }}>
              {t('tr_noLanguageGroupsYet')}
            </Typography>
          </Box>
        )}
      </GroupsContainer>
    </Stack>
  );
};

export default LanguageGroups;
