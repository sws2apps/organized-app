import IconButton from '@components/icon_button';
import { IconCollapseAll, IconExpandAll } from '@components/icons';
import Typography from '@components/typography';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { Box } from '@mui/material';
import useCategorySelector from './useCategorySelector';
import Category from './category';
import Divider from '@components/divider';
import Card from '@components/card';

const CategorySelector = () => {
  const { t } = useAppTranslation();
  const { desktopUp } = useBreakpoints();

  const {
    isCategoriesCollapsed,
    handleToggleCollapsedCategories,
    activeCategory,
    handleToggleActiveCategory,
    categories,
  } = useCategorySelector();

  return (
    <Card
      sx={{
        flexShrink: 0,
        width: desktopUp ? '400px' : '100%',
        position: desktopUp ? 'sticky' : 'unset',
        top: desktopUp ? 78 : 'unset',
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
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {categories.map((category, index) => (
          <>
            <Category
              key={category.key}
              onClick={() => {
                handleToggleActiveCategory(category.key);
              }}
              isActive={activeCategory === category.key}
              isCollapsed={isCategoriesCollapsed}
              icon={category.icon}
              title={category.title}
              entries={[]}
            />
            {categories.length - 1 !== index && (
              <Divider color="var(--accent-200)" />
            )}
          </>
        ))}
      </Box>
    </Card>
  );
};

export default CategorySelector;
