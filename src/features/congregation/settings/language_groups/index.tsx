import { Fragment } from 'react';
import { Box, Stack, Divider, Tooltip } from '@mui/material';
import { IconAdd, IconInfo } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { TabId } from '@pages/congregation/settings/useCongregationSettings';
import useLanguageGroups from './useLanguageGroups';
import GroupAdd from './group_add';
import LanguageGroup from './language_group';
import Typography from '@components/typography';
import Button from '@components/button';
import SettingsTab from '@components/settings_tab';
import { GroupsContainer, GroupsHeader } from './index.styles';

type LanguageGroupsProps = {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  mini?: boolean;
};

const LanguageGroups = ({ activeTab, onTabChange, mini = false }: LanguageGroupsProps) => {
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
          padding: mini ? '12px 4px' : '16px',
        }}
      >
        {!mini && (
          <GroupsHeader>
            <Typography 
              className="h3" 
              color={languageGroups.length > 0 ? 'var(--black)' : 'var(--accent-400)'}
              sx={{ flexGrow: 1, marginRight: '16px', textAlign: 'left' }}
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
        )}

        {languageGroups.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {languageGroups.map((group, index) => (
              <Fragment key={group.group_id}>
                <LanguageGroup
                  group={group}
                  active={activeTab === `language-group-${group.group_id}`}
                  mini={mini}
                  onClick={() => onTabChange(`language-group-${group.group_id}`)}
                />
                {index < languageGroups.length - 1 && !mini && (
                  <Divider key={`divider-${group.group_id}`} sx={{ borderColor: 'var(--accent-200)' }} />
                )}
              </Fragment>
            ))}
          </Box>
        )}

        {languageGroups.length === 0 && !mini && (
          <Box sx={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <IconInfo color="var(--accent-400)" sx={{ flexShrink: 0 }} />
            <Typography className="body-small-regular" color="var(--accent-400)" sx={{ wordBreak: 'break-word' }}>
              {t('tr_noLanguageGroupsYet')}
            </Typography>
          </Box>
        )}

        {languageGroups.length === 0 && mini && (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Tooltip title={t('tr_noLanguageGroupsYet')} placement="right" arrow>
              <Box>
                <IconInfo color="var(--accent-400)" />
              </Box>
            </Tooltip>
          </Box>
        )}

        {fullAccess && mini && (
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: languageGroups.length > 0 ? '6px' : 0 }}>
            <SettingsTab
              renderIcon={(color) => <IconAdd color={color} />}
              label={t('tr_add')}
              description=""
              mini={mini}
              onClick={handleOpenAdd}
            />
          </Box>
        )}
      </GroupsContainer>
    </Stack>
  );
};

export default LanguageGroups;
