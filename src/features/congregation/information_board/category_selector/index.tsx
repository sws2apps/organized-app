import IconButton from '@components/icon_button';
import { IconCollapseAll, IconExpandAll } from '@components/icons';
import Typography from '@components/typography';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { Stack } from '@mui/material';
import useCategorySelector from './useCategorySelector';
import Category from './category';
import Divider from '@components/divider';
import Card from '@components/card';
import { Fragment } from 'react';
import { InformationBoardCategory } from '@definition/information_board';

const CategorySelector = () => {
  const { t } = useAppTranslation();
  const { desktopUp } = useBreakpoints();

  const {
    isCategoriesCollapsed,
    handleToggleCollapsedCategories,
    activeCategory,
    handleChangeActiveCategory,
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
      <Stack direction="row" justifyContent="space-between" alignItems="center">
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
      </Stack>

      <Stack spacing="8px">
        {categories.map((category, index) => (
          <Fragment key={category.key}>
            <Category
              onClick={() =>
                handleChangeActiveCategory(
                  category.key as InformationBoardCategory
                )
              }
              isActive={activeCategory === category.key}
              isCollapsed={isCategoriesCollapsed}
              icon={category.icon}
              title={category.title}
              entries={category.entries}
            />

            {index < categories.length - 1 && (
              <Divider color="var(--accent-200)" />
            )}
          </Fragment>
        ))}
      </Stack>
    </Card>
  );
};

export default CategorySelector;
