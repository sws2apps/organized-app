import { PropsWithChildren } from 'react';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import { ListSubheader } from '@mui/material';
import usePersonFilter from './usePersonFilter';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';

const MenuSubHeader = ({ children }: PropsWithChildren) => {
  return (
    <ListSubheader
      className="body-small-semibold"
      sx={{
        color: 'var(--accent-dark)',
        font: 'inherit',
        padding: '16px 16px 8px 16px',
        userSelect: 'none',
        backgroundColor: 'var(--white)',
      }}
    >
      {children}
    </ListSubheader>
  );
};

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
