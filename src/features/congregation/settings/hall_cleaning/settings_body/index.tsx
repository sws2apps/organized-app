import { Stack } from '@mui/material';
import {
  HALL_CLEANING_GROUP_AMOUNTS,
  hallCleaningGroupCount,
} from '@utils/hall_cleaning_groups';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import { TwoColumnsRow } from '@features/congregation/settings/shared_styles';
import {
  HallCleaningConfigType,
  schedulesHallCleaningMode,
} from '@services/app/schedules';
import { formatDate, getWeekDate } from '@utils/date';
import useHallCleaningSettings from '../useHallCleaningSettings';
import useGroupSelector from '@features/congregation/field_service_groups/group_selector/useGroupSelector';
import RotationOrder from '../rotation_order';
import DatePicker from '@components/date_picker';
import Divider from '@components/divider';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import SwitchWithLabel from '@components/switch_with_label';
import Typography from '@components/typography';

const AMOUNTS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const TURN_LENGTHS = [1, 2, 3, 4, 5, 6];

type HallCleaningAssignTo = HallCleaningConfigType['assign_to']['value'];
type HallCleaningPeriod = HallCleaningConfigType['period']['value'];
type HallCleaningUnit = HallCleaningConfigType['rotation_unit']['value'];

const HallCleaningSettingsBody = () => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const { isGroup } = useCurrentUser();

  const { config, handleChange } = useHallCleaningSettings();

  const { options: groupOptions } = useGroupSelector(true, false);

  const rowSx = {
    flexDirection: laptopUp ? 'row' : 'column',
    alignItems: laptopUp ? 'center' : 'unset',
  };

  if (!config) return null;

  const mode = schedulesHallCleaningMode(config);

  const rotationGroups = config.rotation_groups.value;
  const isRotation = rotationGroups.length > 0;
  const groupOrder = groupOptions.map((option) => option.value);

  const handleToggleRotation = (enabled: boolean) => {
    if (!enabled) {
      handleChange({ rotation_groups: [] });
      return;
    }

    const start =
      config.rotation_start.value || formatDate(getWeekDate(), 'yyyy/MM/dd');

    handleChange({ rotation_groups: groupOrder, rotation_start: start });
  };

  const unitLabel = (unit: HallCleaningUnit) => {
    const plural = config.rotation_length.value > 1;

    if (unit === 'month') return plural ? t('tr_months') : t('tr_month');

    return plural ? t('tr_weeks') : t('tr_week');
  };

  return (
    <Stack
      spacing="16px"
      sx={{ width: '100%' }}
      divider={<Divider color="var(--accent-200)" />}
    >
      <Stack spacing="16px">
        <TwoColumnsRow sx={rowSx}>
          <Typography>{t('tr_hallCleaningPeriod')}</Typography>

          <Select
            inputProps={{ 'aria-label': t('tr_hallCleaningPeriod') }}
            value={config.period.value}
            onChange={(e) =>
              handleChange({ period: e.target.value as HallCleaningPeriod })
            }
          >
            <MenuItem value="meeting">
              <Typography>{t('tr_hallCleaningEachMeeting')}</Typography>
            </MenuItem>
            <MenuItem value="week">
              <Typography>{t('tr_hallCleaningWholeWeek')}</Typography>
            </MenuItem>
          </Select>
        </TwoColumnsRow>

        {!isGroup && (
          <TwoColumnsRow sx={rowSx}>
            <Typography>{t('tr_hallCleaningAssign')}</Typography>

            <Select
              inputProps={{ 'aria-label': t('tr_hallCleaningAssign') }}
              value={config.assign_to.value}
              onChange={(e) =>
                handleChange({
                  assign_to: e.target.value as HallCleaningAssignTo,
                })
              }
            >
              <MenuItem value="group">
                <Typography>{t('tr_hallCleaningAssignGroup')}</Typography>
              </MenuItem>
              <MenuItem value="group_persons">
                <Typography>
                  {t('tr_hallCleaningAssignGroupPublishers')}
                </Typography>
              </MenuItem>
              <MenuItem value="persons">
                <Typography>{t('tr_hallCleaningAssignPublishers')}</Typography>
              </MenuItem>
            </Select>
          </TwoColumnsRow>
        )}

        {!isGroup && mode === 'group' && (
          <TwoColumnsRow sx={rowSx}>
            <Typography>{t('tr_hallCleaningGroupAmount')}</Typography>
            <Select
              inputProps={{ 'aria-label': t('tr_hallCleaningGroupAmount') }}
              value={hallCleaningGroupCount(config.group_amount?.value)}
              onChange={(e) =>
                handleChange({ group_amount: Number(e.target.value) })
              }
            >
              {HALL_CLEANING_GROUP_AMOUNTS.map((amount) => (
                <MenuItem key={amount} value={amount}>
                  <Typography>{amount}</Typography>
                </MenuItem>
              ))}
            </Select>
          </TwoColumnsRow>
        )}

        {mode !== 'group' && (
          <TwoColumnsRow sx={rowSx}>
            <Typography>{t('tr_hallCleaningAmount')}</Typography>

            <Select
              inputProps={{ 'aria-label': t('tr_hallCleaningAmount') }}
              value={config.amount.value}
              onChange={(e) => handleChange({ amount: Number(e.target.value) })}
            >
              {AMOUNTS.map((num) => (
                <MenuItem key={num} value={num}>
                  <Typography>{num}</Typography>
                </MenuItem>
              ))}
            </Select>
          </TwoColumnsRow>
        )}
      </Stack>

      {mode !== 'persons' && (
        <Stack spacing="16px">
          <SwitchWithLabel
            label={t('tr_hallCleaningRotation')}
            helper={
              groupOrder.length === 0
                ? t('tr_noGroupsYet')
                : t('tr_hallCleaningRotationDesc')
            }
            checked={isRotation}
            readOnly={groupOrder.length === 0}
            onChange={handleToggleRotation}
          />

          {isRotation && (
            <>
              <TwoColumnsRow sx={rowSx}>
                <Typography>{t('tr_hallCleaningTurnLength')}</Typography>

                <Stack
                  direction="row"
                  spacing="8px"
                  sx={{ width: '100%', minWidth: 0 }}
                >
                  <Select
                    inputProps={{
                      'aria-label': t('tr_hallCleaningTurnLength'),
                    }}
                    sx={{ flex: 1, minWidth: 0 }}
                    value={config.rotation_length.value}
                    onChange={(e) =>
                      handleChange({ rotation_length: Number(e.target.value) })
                    }
                  >
                    {TURN_LENGTHS.map((num) => (
                      <MenuItem key={num} value={num}>
                        <Typography>{num}</Typography>
                      </MenuItem>
                    ))}
                  </Select>

                  <Select
                    inputProps={{ 'aria-label': t('tr_hallCleaningTurnUnit') }}
                    sx={{ flex: 2, minWidth: 0 }}
                    value={config.rotation_unit.value}
                    onChange={(e) =>
                      handleChange({
                        rotation_unit: e.target.value as HallCleaningUnit,
                      })
                    }
                  >
                    <MenuItem value="week">
                      <Typography>{unitLabel('week')}</Typography>
                    </MenuItem>
                    <MenuItem value="month">
                      <Typography>{unitLabel('month')}</Typography>
                    </MenuItem>
                  </Select>
                </Stack>
              </TwoColumnsRow>

              <Stack spacing="8px">
                <Typography>{t('tr_hallCleaningTurnOrder')}</Typography>
                <RotationOrder
                  groups={groupOptions}
                  rotation={rotationGroups}
                  onChange={(value) => handleChange({ rotation_groups: value })}
                />
              </Stack>

              <Stack spacing="8px" sx={{ width: '100%', minWidth: 0 }}>
                <DatePicker
                  label={t('tr_startWeek')}
                  value={
                    config.rotation_start.value
                      ? new Date(config.rotation_start.value)
                      : null
                  }
                  onChange={(date) => {
                    if (!date) return;

                    handleChange({
                      rotation_start: formatDate(
                        getWeekDate(date),
                        'yyyy/MM/dd'
                      ),
                    });
                  }}
                />
                <Typography
                  className="label-small-regular"
                  color="var(--grey-400)"
                >
                  {t('tr_hallCleaningTurnsChangeDesc')}
                </Typography>
              </Stack>
            </>
          )}
        </Stack>
      )}
    </Stack>
  );
};

export default HallCleaningSettingsBody;
