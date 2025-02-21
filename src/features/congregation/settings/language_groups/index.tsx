import { IconAdd } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { CardSection, CardSectionHeader } from '../shared_styles';
import useLanguageGroups from './useLanguageGroups';
import Button from '@components/button';
import FeatureFlag from '@components/feature_flag';
import ToggleOption from './toggle_option';
import GroupAdd from './group_add';

const LanguageGroups = () => {
  const { t } = useAppTranslation();

  const { enabled, isAdd, handleCloseAdd, handleOpenAdd } = useLanguageGroups();

  return (
    <FeatureFlag flag="LANGUAGE_GROUPS">
      <CardSection sx={{ gap: '16px' }}>
        {isAdd && <GroupAdd open={isAdd} onClose={handleCloseAdd} />}

        <CardSectionHeader
          title={t('tr_langGroups')}
          description={t('tr_langGroupsDesc')}
          sx={{ flex: 1 }}
        />

        <ToggleOption />

        {enabled && (
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
    </FeatureFlag>
  );
};

export default LanguageGroups;
