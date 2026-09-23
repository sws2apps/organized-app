import { Stack } from '@mui/material';
import { useAtomValue } from 'jotai';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import {
  CardSection,
  CardSectionContent,
  CardSectionHeader,
  CardSubSectionHeader,
  TwoColumnsRow,
} from '@features/congregation/settings/shared_styles';
import Checkbox from '@components/checkbox';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import { territoryCategoriesState } from '@states/territories';
import { TerritoryAccess, TerritoryType } from '@definition/territory';
import useTerritorySettings from './useTerritorySettings';

const TYPE_LABELS: Record<TerritoryType, string> = {
  door_to_door: 'tr_territoryTypeDoorToDoor',
  business: 'tr_territoryTypeBusiness',
  phone: 'tr_territoryTypeCall',
};

const ACCESS_LABELS: Record<TerritoryAccess, string> = {
  own: 'tr_territoryAccessOwn',
  view: 'tr_territoryAccessView',
  request: 'tr_territoryAccessRequest',
};

const TerritorySettings = () => {
  const { t } = useAppTranslation();

  const { isServiceCommittee } = useCurrentUser();

  const {
    access,
    restrictedCategories,
    restrictedTypes,
    handleAccessChange,
    handleRestrictedCategoriesChange,
    handleRestrictedTypesChange,
  } = useTerritorySettings();

  const categories = useAtomValue(territoryCategoriesState);

  return (
    <CardSection>
      <CardSectionHeader title={t('tr_territories')} />

      <CardSectionContent>
        <Stack spacing="16px">
          <CardSubSectionHeader
            title={t('tr_territoryAccess')}
            description={t('tr_territoryAccessDesc')}
          />

          <Select
            label={t('tr_territoryAccess')}
            value={access}
            onChange={(event) =>
              handleAccessChange(event.target.value as TerritoryAccess)
            }
            readOnly={!isServiceCommittee}
          >
            {(Object.keys(ACCESS_LABELS) as TerritoryAccess[]).map((option) => (
              <MenuItem key={option} value={option}>
                {t(ACCESS_LABELS[option])}
              </MenuItem>
            ))}
          </Select>

          <CardSubSectionHeader
            title={t('tr_territoryNotOffered')}
            description={t('tr_territoryNotOfferedDesc')}
          />

          <TwoColumnsRow>
            <Select
              label={t('tr_categories')}
              multiple
              value={restrictedCategories}
              renderValue={(values) =>
                categories
                  .filter((category) =>
                    (values as string[]).includes(category.id)
                  )
                  .map((category) => category.name)
                  .join(', ')
              }
              onChange={(event) =>
                handleRestrictedCategoriesChange(event.target.value as string[])
              }
              readOnly={!isServiceCommittee}
            >
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  <Checkbox
                    label={category.name}
                    checked={restrictedCategories.includes(category.id)}
                  />
                </MenuItem>
              ))}
            </Select>

            <Select
              label={t('tr_territoryTypes')}
              multiple
              value={restrictedTypes}
              renderValue={(values) =>
                (values as TerritoryType[])
                  .map((type) => t(TYPE_LABELS[type]))
                  .join(', ')
              }
              onChange={(event) =>
                handleRestrictedTypesChange(
                  event.target.value as TerritoryType[]
                )
              }
              readOnly={!isServiceCommittee}
            >
              {(Object.keys(TYPE_LABELS) as TerritoryType[]).map((type) => (
                <MenuItem key={type} value={type}>
                  <Checkbox
                    label={t(TYPE_LABELS[type])}
                    checked={restrictedTypes.includes(type)}
                  />
                </MenuItem>
              ))}
            </Select>
          </TwoColumnsRow>
        </Stack>
      </CardSectionContent>
    </CardSection>
  );
};

export default TerritorySettings;
