import { Box } from '@mui/material';
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

  const { desktopUp } = useBreakpoints();

  const { isWeekendEditor } = useCurrentUser();

  const {
    handleWTConductorMainPersonChange,
    handleWTConductorToggle,
    personsWTCondcutorList,
    subtituteWTConductorDisplayed,
    wtConductorMainPerson,
  } = useStudyConductor();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: desktopUp ? 'row' : 'column',
        alignItems: desktopUp ? 'center' : 'stretch',
        gap: '16px',
      }}
    >
      <Box sx={{ flex: desktopUp ? 65 : 1 }}>
        <SwitchWithLabel
          label={t('tr_displayWSConductorSubstitutions')}
          helper={t('tr_displayWSConductorDesc')}
          checked={subtituteWTConductorDisplayed}
          onChange={handleWTConductorToggle}
          readOnly={!isWeekendEditor}
        />
      </Box>

      <Box sx={{ flex: desktopUp ? 35 : 1 }}>
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
      </Box>
    </Box>
  );
};

export default StudyConductor;
