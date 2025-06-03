import { useAppTranslation, useCurrentUser } from '@hooks/index';
import usePersonFilter from './usePersonFilter';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';
import MenuSubHeader from '@components/menu_sub_header';

const PersonFilter = () => {
  const { t } = useAppTranslation();

  const { isSecretary, isGroup } = useCurrentUser();

  const {
    filter,
    handleChangeFilter,
    filters,
    show_group,
    show_language_group,
  } = usePersonFilter();

  return (
    <Select
      value={filter}
      onChange={(e) => handleChangeFilter(e.target.value as string)}
    >
      {isSecretary && !isGroup && (
        <MenuSubHeader>{t('tr_publishers')}</MenuSubHeader>
      )}

      {isSecretary &&
        !isGroup &&
        filters
          .find((f) => f.key === 'publishers')
          .options.map((option) => (
            <MenuItem key={option.key} value={option.key}>
              <Typography>{option.name}</Typography>
            </MenuItem>
          ))}

      {isSecretary && !isGroup && (
        <MenuSubHeader>{t('tr_pioneers')}</MenuSubHeader>
      )}

      {isSecretary &&
        !isGroup &&
        filters
          .find((f) => f.key === 'pioneers')
          .options.map((option) => (
            <MenuItem key={option.key} value={option.key}>
              <Typography>{option.name}</Typography>
            </MenuItem>
          ))}

      {isSecretary && show_group && (
        <MenuSubHeader>{t('tr_fieldServiceGroups')}</MenuSubHeader>
      )}

      {show_group &&
        filters
          .find((f) => f.key === 'groups')
          .options.map((option) => (
            <MenuItem key={option.key} value={option.key}>
              <Typography>{option.name}</Typography>
            </MenuItem>
          ))}

      {isSecretary && !isGroup && show_language_group && (
        <MenuSubHeader>{t('tr_langGroups')}</MenuSubHeader>
      )}

      {show_language_group &&
        filters
          .find((f) => f.key === 'language_groups')
          .options.map((option) => (
            <MenuItem key={option.key} value={option.key}>
              <Typography>{option.name}</Typography>
            </MenuItem>
          ))}
    </Select>
  );
};

export default PersonFilter;
