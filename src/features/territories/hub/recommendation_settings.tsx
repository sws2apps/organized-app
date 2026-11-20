import { useAppTranslation } from '@hooks/index';
import { useAtom, useAtomValue } from 'jotai';
import { Stack } from '@mui/material';
import { Select, Typography } from '@components/index';
import MenuItem from '@components/menuitem';
import {
  territoryCategoriesState,
  territoryRecommendationsState,
} from '@states/territories';
import { TerritoryType, TYPE_LABEL } from '@definition/territory';

const RecommendationSettings = () => {
  const { t } = useAppTranslation();

  const [value, setValue] = useAtom(territoryRecommendationsState);
  const categories = useAtomValue(territoryCategoriesState);
  return (
    <Stack spacing="16px">
      <Typography className="h4">{t('tr_territoryRecommendations')}</Typography>
      <Select
        label={t('tr_territoryMonthsAfterReturn')}
        value={value.cooldownMonths}
        onChange={(event) =>
          setValue({ ...value, cooldownMonths: Number(event.target.value) })
        }
      >
        {Array.from({ length: 13 }, (_, n) => (
          <MenuItem key={n} value={n}>
            {n === 0 ? t('tr_territoryNoWaitingPeriod') : n}
          </MenuItem>
        ))}
      </Select>
      <Typography className="body-small-regular" color="var(--grey-400)">
        {t(
          'tr_territoryMonthsSinceLastReturnNeverAssignedTerritoriesAppearImmediately'
        )}
      </Typography>
      <Select
        multiple
        label={t('tr_territoryExcludeCategories')}
        value={value.categories}
        onChange={(event) =>
          setValue({ ...value, categories: event.target.value as string[] })
        }
      >
        {categories.map((item) => (
          <MenuItem key={item.id} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
      <Select
        multiple
        label={t('tr_territoryExcludeTerritoryTypes')}
        value={value.types}
        onChange={(event) =>
          setValue({ ...value, types: event.target.value as TerritoryType[] })
        }
      >
        {(Object.keys(TYPE_LABEL) as TerritoryType[]).map((type) => (
          <MenuItem key={type} value={type}>
            {t(TYPE_LABEL[type])}
          </MenuItem>
        ))}
      </Select>
      <Typography className="body-small-regular" color="var(--grey-400)">
        {t('tr_territoryExcludedTerritoriesRemainAvailableInAllTerritories')}
      </Typography>
    </Stack>
  );
};
export default RecommendationSettings;
