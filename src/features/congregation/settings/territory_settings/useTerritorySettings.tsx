import { useAtomValue } from 'jotai';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import {
  territoryAccessState,
  territoryRestrictedCategoriesState,
  territoryRestrictedTypesState,
} from '@states/settings';
import { TerritoryAccess, TerritoryType } from '@definition/territory';

const useTerritorySettings = () => {
  const access = useAtomValue(territoryAccessState);
  const restrictedCategories = useAtomValue(territoryRestrictedCategoriesState);
  const restrictedTypes = useAtomValue(territoryRestrictedTypesState);

  const updatedAt = () => new Date().toISOString();

  const handleAccessChange = async (value: TerritoryAccess) => {
    await dbAppSettingsUpdate({
      'cong_settings.territory_access': { value, updatedAt: updatedAt() },
    });
  };

  const handleRestrictedCategoriesChange = async (value: string[]) => {
    await dbAppSettingsUpdate({
      'cong_settings.territory_restricted_categories': {
        value,
        updatedAt: updatedAt(),
      },
    });
  };

  const handleRestrictedTypesChange = async (value: TerritoryType[]) => {
    await dbAppSettingsUpdate({
      'cong_settings.territory_restricted_types': {
        value,
        updatedAt: updatedAt(),
      },
    });
  };

  return {
    access,
    restrictedCategories,
    restrictedTypes,
    handleAccessChange,
    handleRestrictedCategoriesChange,
    handleRestrictedTypesChange,
  };
};

export default useTerritorySettings;
