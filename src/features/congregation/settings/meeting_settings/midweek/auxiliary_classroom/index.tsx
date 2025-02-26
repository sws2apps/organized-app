import { TwoColumnsRow } from '@features/congregation/settings/shared_styles';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import useAuxiliaryClassroom from './useAuxiliaryClassroom';
import Select from '@components/select';
import SwitchWithLabel from '@components/switch_with_label';
import MenuItem from '@components/menuitem';
import Typography from '@components/typography';

const AuxiliaryClassroom = () => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const { isMidweekEditor } = useCurrentUser();

  const {
    auxClassEnabled,
    handleAuxClassToggle,
    auxCounselorMainEnabled,
    handleAuxCounselorMainToggle,
    personsAuxCounselorList,
    auxCounselorMainPerson,
    handleAuxCounselorMainPersonChange,
    auxClassAssignFSG,
    handleAuxClassAssignFSGToggle,
  } = useAuxiliaryClassroom();

  return (
    <>
      <SwitchWithLabel
        label={t('tr_auxClassroom')}
        checked={auxClassEnabled}
        onChange={handleAuxClassToggle}
        readOnly={!isMidweekEditor}
      />

      {auxClassEnabled && (
        <>
          <TwoColumnsRow
            sx={{
              flexDirection: laptopUp ? 'row' : 'column',
              alignItems: laptopUp ? 'center' : 'unset',
            }}
          >
            <SwitchWithLabel
              label={t('tr_assignAuxCounselor')}
              helper={t('tr_assignAuxCounserlorDesc')}
              checked={auxCounselorMainEnabled}
              onChange={handleAuxCounselorMainToggle}
              readOnly={!isMidweekEditor}
            />

            <Select
              label={t('tr_auxClassCounselor')}
              value={auxCounselorMainPerson}
              onChange={(e) =>
                handleAuxCounselorMainPersonChange(e.target.value as string)
              }
              readOnly={!isMidweekEditor}
            >
              {personsAuxCounselorList.length === 0 ? (
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
                personsAuxCounselorList.map((person) => (
                  <MenuItem key={person.value} value={person.value}>
                    <Typography>{person.label}</Typography>
                  </MenuItem>
                ))
              )}
            </Select>
          </TwoColumnsRow>

          <SwitchWithLabel
            label={t('tr_auxClassroomAssignServiceGroup')}
            helper={t('tr_auxClassroomAssignServiceGroupDesc')}
            checked={auxClassAssignFSG}
            onChange={handleAuxClassAssignFSGToggle}
            readOnly={!isMidweekEditor}
          />
        </>
      )}
    </>
  );
};

export default AuxiliaryClassroom;
