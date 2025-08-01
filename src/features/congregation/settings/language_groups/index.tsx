import { Stack } from '@mui/material';
import { IconAdd } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { CardSection, CardSectionHeader } from '../shared_styles';
import useLanguageGroups from './useLanguageGroups';
import Button from '@components/button';
import Divider from '@components/divider';
import GroupAdd from './group_add';
import LanguageGroup from './language_group';
import ToggleOption from './toggle_option';

const LanguageGroups = () => {
  const { t } = useAppTranslation();

  const {
    enabled,
    isAdd,
    handleCloseAdd,
    handleOpenAdd,
    languageGroups,
    fullAccess,
  } = useLanguageGroups();

  return (
    <CardSection sx={{ gap: '16px' }}>
      {fullAccess && isAdd && (
        <GroupAdd open={isAdd} onClose={handleCloseAdd} />
      )}

      <CardSectionHeader
        title={t('tr_langGroups')}
        description={fullAccess && t('tr_langGroupsDesc')}
        sx={{ flex: 1 }}
      />

      {fullAccess && <ToggleOption />}

      {enabled && languageGroups.length > 0 && (
        <>
          {fullAccess && <Divider color="var(--accent-200)" />}

          <Stack spacing="16px" divider={<Divider color="var(--accent-200)" />}>
            {languageGroups.map((group) => (
              <LanguageGroup key={group.group_id} group={group} />
            ))}
          </Stack>
        </>
      )}

      {fullAccess && enabled && (
        <Button
          variant="small"
          onClick={handleOpenAdd}
          startIcon={<IconAdd />}
          sx={{
            height: '32px',
            minHeight: '32px !important',
            alignSelf: 'flex-start',
          }}
        >
          {t('tr_add')}
        </Button>
      )}
    </CardSection>
  );
};

export default LanguageGroups;
