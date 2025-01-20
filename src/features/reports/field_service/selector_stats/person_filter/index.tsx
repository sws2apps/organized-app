import { useAppTranslation, useCurrentUser } from '@hooks/index';
import usePersonFilter from './usePersonFilter';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';
import MenuSubHeader from '@components/menu_sub_header';

const PersonFilter = () => {
  const { t } = useAppTranslation();

  const { isSecretary } = useCurrentUser();

  const { filter, handleChangeFilter, filters, show_group } = usePersonFilter();

  return (
    <Select
      value={filter}
      onChange={(e) => handleChangeFilter(e.target.value as string)}
    >
      {isSecretary && <MenuSubHeader>{t('tr_publishers')}</MenuSubHeader>}

      {isSecretary &&
        filters
          .find((f) => f.key === 'publishers')
          .options.map((option) => (
            <MenuItem key={option.key} value={option.key}>
              <Typography>{option.name}</Typography>
            </MenuItem>
          ))}

      {isSecretary && <MenuSubHeader>{t('tr_pioneers')}</MenuSubHeader>}

      {isSecretary &&
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
    </Select>
  );
};

export default PersonFilter;
