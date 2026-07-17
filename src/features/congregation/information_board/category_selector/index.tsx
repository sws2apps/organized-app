import IconButton from '@components/icon_button';
import {
  IconCollapseAll,
  IconDrawShape,
  IconExpandAll,
} from '@components/icons';
import Typography from '@components/typography';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { Box } from '@mui/material';
import useCategorySelector from './useCategorySelector';
import Category from './category';

const CategorySelector = () => {
  const { t } = useAppTranslation();
  const { desktopUp } = useBreakpoints();

  const { isCategoriesCollapsed, handleToggleCollapsedCategories } =
    useCategorySelector();

  return (
    <Box
      sx={{
        width: desktopUp ? '400px' : '100%',
        flexShrink: 0,
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--accent-300)',
        backgroundColor: 'var(--white)',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        position: desktopUp ? 'sticky' : 'unset',
        top: desktopUp ? 57 : 'unset',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography className="h3">{t('tr_categories')}</Typography>
        <IconButton
          onClick={handleToggleCollapsedCategories}
          aria-label={isCategoriesCollapsed ? t('tr_collapse') : t('tr_expand')}
        >
          {isCategoriesCollapsed ? (
            <IconCollapseAll color="var(--black)" />
          ) : (
            <IconExpandAll color="var(--black)" />
          )}
        </IconButton>
      </Box>
    </Box>
  );
};

export default CategorySelector;
