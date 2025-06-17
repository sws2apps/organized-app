import { Stack } from '@mui/material';
import {
  useAppTranslation,
  useBreakpoints,
  useCurrentUser,
} from '@hooks/index';
import { AssignmentFieldType } from '@definition/assignment';
import useLinkedParts from './useLinkedParts';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';

const LinkedParts = () => {
  const { t } = useAppTranslation();

  const { tabletUp } = useBreakpoints();

  const { isMidweekEditor } = useCurrentUser();

  const {
    options,
    openingPrayerAssignment,
    closingPrayerAssignment,
    handleOpeningPrayerAssignmentChange,
    handleClosingPrayerAssignmentChange,
  } = useLinkedParts();

  return (
    <>
      <Typography className="body-small-regular" color="var(--grey-400)">
        {t('tr_linkedPartsDesc')}
      </Typography>

      <Stack spacing="16px" direction={`${tabletUp ? 'row' : 'column'}`}>
        <Select
          label={t('tr_linkOpeningPrayer')}
          fullWidth={false}
          sx={{ width: '100%', flex: 1 }}
          readOnly={!isMidweekEditor}
          value={openingPrayerAssignment}
          onChange={(e) => {
            handleOpeningPrayerAssignmentChange(
              e.target.value as AssignmentFieldType
            );
          }}
        >
          {options.map((opt) => (
            <MenuItem key={opt.id} value={opt.id}>
              <Typography>{opt.name}</Typography>
            </MenuItem>
          ))}
        </Select>
        <Select
          label={t('tr_linkClosingPrayer')}
          fullWidth={false}
          sx={{ width: '100%', flex: 1 }}
          readOnly={!isMidweekEditor}
          value={closingPrayerAssignment}
          onChange={(e) => {
            handleClosingPrayerAssignmentChange(
              e.target.value as AssignmentFieldType
            );
          }}
        >
          {options.map((opt) => (
            <MenuItem key={opt.id} value={opt.id}>
              <Typography>{opt.name}</Typography>
            </MenuItem>
          ))}
        </Select>
      </Stack>
    </>
  );
};

export default LinkedParts;
