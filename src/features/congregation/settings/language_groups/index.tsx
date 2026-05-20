import { Fragment } from 'react';
import { Stack, Divider } from '@mui/material';
import { IconAdd, IconInfo } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { TabId } from '@pages/congregation/settings/useCongregationSettings';
import useLanguageGroups from './useLanguageGroups';
import GroupAdd from './group_add';
import LanguageGroup from './language_group';
import Typography from '@components/typography';
import Button from '@components/button';
import { GroupsContainer, GroupsHeader, GroupItemsList, EmptyStateRow } from './index.styles';

type LanguageGroupsProps = {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
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
        <GroupAdd
          open={isAdd}
          onClose={handleCloseAdd}
          onSuccess={(groupId) => {
            handleCloseAdd();
            onTabChange(`language-group-${groupId}`);
          }}
        />
      )}

      <GroupsContainer
        sx={{
          backgroundColor: languageGroups.length === 0 ? 'var(--accent-150)' : 'var(--white)',
          border: languageGroups.length === 0 ? '1px dashed var(--accent-300)' : '1px solid var(--accent-300)',
        }}
      >
        <GroupsHeader>
          <Typography 
            className="h3" 
            color={languageGroups.length > 0 ? 'var(--black)' : 'var(--accent-400)'}
            sx={{ flexGrow: 1, marginInlineEnd: '16px', textAlign: 'start' }}
          >
            {t('tr_langGroups')}
          </Typography>
          {fullAccess && (
            <Button
              variant="small"
              disableAutoStretch
              startIcon={<IconAdd />}
              onClick={handleOpenAdd}
            >
              {t('tr_add')}
            </Button>
          )}
        </GroupsHeader>

        {languageGroups.length > 0 && (
          <GroupItemsList>
            {languageGroups.map((group, index) => (
              <Fragment key={group.group_id}>
                <LanguageGroup
                  group={group}
                  active={activeTab === `language-group-${group.group_id}`}
                  onClick={() => onTabChange(`language-group-${group.group_id}`)}
                />
                {index < languageGroups.length - 1 && (
                  <Divider key={`divider-${group.group_id}`} sx={{ borderColor: 'var(--accent-200)' }} />
                )}
              </Fragment>
            ))}
          </GroupItemsList>
        )}

        {languageGroups.length === 0 && (
          <EmptyStateRow>
            <IconInfo color="var(--accent-400)" sx={{ flexShrink: 0 }} />
            <Typography className="body-small-regular" color="var(--accent-400)" sx={{ wordBreak: 'break-word' }}>
              {t('tr_noLanguageGroupsYet')}
            </Typography>
          </EmptyStateRow>
        )}
      </GroupsContainer>
    </Stack>
  );
};

export default LanguageGroups;
