import { TwoColumnsRow } from '@features/congregation/settings/shared_styles';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useStudyConductor from './useStudyConductor';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import SwitchWithLabel from '@components/switch_with_label';
import Typography from '@components/typography';

const StudyConductor = () => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const {
    handleWTConductorMainPersonChange,
    handleWTConductorToggle,
    personsWTCondcutorList,
    subtituteWTConductorDisplayed,
    wtConductorMainPerson,
  } = useStudyConductor();

  return (
    <TwoColumnsRow
      sx={{
        flexDirection: laptopUp ? 'row' : 'column',
        alignItems: laptopUp ? 'center' : 'unset',
      }}
    >
      <SwitchWithLabel
        label={t('tr_displayWSConductorSubstitutions')}
        helper={t('tr_displayWSConductorDesc')}
        checked={subtituteWTConductorDisplayed}
        onChange={handleWTConductorToggle}
      />

      <Select
        label={t('tr_mainStudyConductor')}
        value={wtConductorMainPerson}
        onChange={(e) =>
          handleWTConductorMainPersonChange(e.target.value as string)
        }
      >
        {personsWTCondcutorList.map((person) => (
          <MenuItem key={person.value} value={person.value}>
            <Typography>{person.label}</Typography>
          </MenuItem>
        ))}
      </Select>
    </TwoColumnsRow>
  );
};

export default StudyConductor;
