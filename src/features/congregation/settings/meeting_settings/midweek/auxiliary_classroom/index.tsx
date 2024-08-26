import { TwoColumnsRow } from '@features/congregation/shared_styles/components';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useAuxiliaryClassroom from './useAuxiliaryClassroom';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import SwitchWithLabel from '@components/switch_with_label';
import Typography from '@components/typography';

const AuxiliaryClassroom = () => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const {
    auxClassEnabled,
    handleAuxClassToggle,
    auxCounselorMainEnabled,
    handleAuxCounselorMainToggle,
    personsAuxCounselorList,
    auxCounselorMainPerson,
    handleAuxCounselorMainPersonChange,
  } = useAuxiliaryClassroom();

  return (
    <>
      <SwitchWithLabel
        label={t('tr_auxClassroom')}
        checked={auxClassEnabled}
        onChange={handleAuxClassToggle}
      />

      {auxClassEnabled && (
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
          />

          <Select
            label={t('tr_auxClassCounselor')}
            value={auxCounselorMainPerson}
            onChange={(e) => handleAuxCounselorMainPersonChange(e.target.value)}
          >
            {personsAuxCounselorList.map((person) => (
              <MenuItem key={person.value} value={person.value}>
                <Typography>{person.label}</Typography>
              </MenuItem>
            ))}
          </Select>
        </TwoColumnsRow>
      )}
    </>
  );
};

export default AuxiliaryClassroom;
