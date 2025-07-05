import { Box, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { IconInfo } from '@components/icons';
import { AssignmentHistoryType } from '@definition/schedules';
import { DisplayRange } from './indextypes';
import useMyAssignments from './useAssignments';
import Drawer from '@components/drawer';
import Markup from '@components/text_markup';
import MenuItem from '@components/menuitem';
import MonthContainer from './month_container';
import NoAssigmentsImg from '@assets/img/illustration_no_assigments.svg?component';
import Select from '@components/select';
import TabLabel from '@components/tab_label_with_badge';
import Tabs from '@components/tabs';
import Typography from '@components/typography';

const MyAssignments = () => {
  const { t } = useAppTranslation();

  const { tabletDown, laptopDown } = useBreakpoints();

  const {
    handleClose,
    handleOpenManageAccess,
    open,
    isSetup,
    displayRange,
    handleRangeChange,
    personAssignments: { ownAssignments, delegateAssignments },
  } = useMyAssignments();

  const hasDelegatedAssignments = delegateAssignments.total > 0;

  const actionComponent = (
    <Box
      sx={{
        width: tabletDown || !hasDelegatedAssignments ? '100%' : '240px',
      }}
    >
      <Select
        label={t('tr_display')}
        value={displayRange}
        onChange={(e) => {
          handleRangeChange(+e.target.value);
        }}
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
    </Box>
  );

  const renderAssignments = (
    assignments: {
      month: string;
      children: AssignmentHistoryType[];
    }[]
  ) => (
    <Box
      sx={{
        height: tabletDown ? '70dvh' : laptopDown ? '80dvh' : '77dvh',
        overflowY: 'scroll',
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        paddingBottom: laptopDown ? '20px' : '10px',
      }}
    >
      {assignments.length === 0 ? (
        <Box
          sx={{
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
          }}
        >
          <NoAssigmentsImg viewBox="0 0 128 128" />
          <Stack spacing="8px">
            <Typography className="h2">{t('tr_noAssignmentsYet')}</Typography>
            <Typography color="var(--grey-400)" sx={{ maxWidth: '350px' }}>
              {t('tr_noAssignmentsYetDesc')}
            </Typography>
          </Stack>
        </Box>
      ) : (
        <Stack spacing={2.3}>
          {assignments.map((month) => (
            <MonthContainer key={month.month} monthData={month} />
          ))}
        </Stack>
      )}
    </Box>
  );

  const tabs = [
    {
      label: <TabLabel count={ownAssignments.total} label={t('tr_myOwn')} />,
      Component: renderAssignments(ownAssignments.byDate),
    },
    ...(hasDelegatedAssignments
      ? [
          {
            label: (
              <TabLabel
                count={delegateAssignments.total}
                label={t('tr_delegated')}
              />
            ),
            Component: renderAssignments(delegateAssignments.byDate),
          },
        ]
      : []),
  ];

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
        <Box
          sx={{
            display: 'flex',
            gap: '16px',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            flexDirection: tabletDown ? 'column' : 'row',
          }}
        >
          <Tabs
            tabs={tabs}
            actionComponent={actionComponent}
            showTabs={hasDelegatedAssignments}
          />
        </Box>
      )}
    </Drawer>
  );
};

export default MyAssignments;
