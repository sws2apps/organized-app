import { TwoColumnsRow } from '@features/congregation/settings/shared_styles';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import useStudyConductor from './useStudyConductor';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import SwitchWithLabel from '@components/switch_with_label';
import Typography from '@components/typography';

const StudyConductor = () => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const { isWeekendEditor } = useCurrentUser();

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
        readOnly={!isWeekendEditor}
      />

      <Select
        label={t('tr_mainStudyConductor')}
        value={wtConductorMainPerson}
        onChange={(e) =>
          handleWTConductorMainPersonChange(e.target.value as string)
        }
        readOnly={!isWeekendEditor}
      >
        {personsWTCondcutorList.length === 0 ? (
          <Typography
            className="body-small-regular"
            color="var(--grey-350)"
            sx={{
              marginLeft: '8px',
              marginRight: '8px',
              maxWidth: '300px',
            }}
          >
            {t('tr_notFoundReviewAssignmentQualifications')}
          </Typography>
        ) : (
          personsWTCondcutorList.map((person) => (
            <MenuItem key={person.value} value={person.value}>
              <Typography>{person.label}</Typography>
            </MenuItem>
          ))
        )}
      </Select>
    </TwoColumnsRow>
  );
};

export default StudyConductor;
