import { Box, Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { IconInfo } from '@components/icons';
import Drawer from '@components/drawer';
import Select from '@components/select';
import Typography from '@components/typography';
import Markup from '@components/text_markup';
import useMyAssignments from './useAssignments';
import MenuItem from '@components/menuitem';
import { DisplayRange } from './indextypes';
import MonthContainer from './month_container';

const MyAssignments = () => {
  const { t } = useAppTranslation();

  const {
    handleClose,
    handleOpenManageAccess,
    open,
    isSetup,
    displayRange,
    handleRangeChange,
    personAssignments,
  } = useMyAssignments();

  return (
    <Drawer
      anchor={'left'}
      open={open}
      onClose={handleClose}
      title={t('tr_viewMyAssignments')}
    >
      {isSetup && (
        <Box sx={{ display: 'flex', gap: '16px' }}>
          <IconInfo color="var(--black)" />
          <Markup
            content={t('tr_bindUserRecordAssignmentsNotice')}
            className="body-regular"
            anchorClassName="h4"
            anchorClick={handleOpenManageAccess}
          />
        </Box>
      )}

      {!isSetup && (
        <Stack spacing={2.3}>
          <Select
            label={t('tr_display')}
            value={displayRange}
            onChange={(e) => handleRangeChange(+e.target.value)}
          >
            <MenuItem value={DisplayRange.MONTHS_3}>
              <Typography>{t('tr_next3MonthsLabel')}</Typography>
            </MenuItem>
            <MenuItem value={DisplayRange.MONTHS_6}>
              <Typography>{t('tr_next6MonthsLabel')}</Typography>
            </MenuItem>
            <MenuItem value={DisplayRange.MONTHS_12}>
              <Typography>{t('tr_next12MonthsLabel')}</Typography>
            </MenuItem>
          </Select>

          {personAssignments.map((month) => (
            <MonthContainer key={month.month} monthData={month} />
          ))}
        </Stack>
      )}
    </Drawer>
  );
};

export default MyAssignments;
