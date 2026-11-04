import { Box } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import useMyAssignments from './useAssignments';
import AssignmentsList from './assignments_list';
import Drawer from '@components/drawer';
import InfoNote from '@components/info_note';
import Markup from '@components/text_markup';
import NoAssignments from './no_assignments';
import Tabs from '@components/tabs';

const MyAssignments = () => {
  const { t } = useAppTranslation();

  const {
    handleClose,
    handleOpenManageAccess,
    handleOpenAssignment,
    open,
    isSetup,
    personAssignments: { ownAssignments, delegateAssignments },
    tab,
    setTab,
    hasDelegated,
    current,
  } = useMyAssignments();

  const tabs = [
    { label: t('tr_myOwn'), badge: ownAssignments.total },
    ...(hasDelegated
      ? [{ label: t('tr_delegated'), badge: delegateAssignments.total }]
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
        <InfoNote>
          <Markup
            content={t('tr_bindUserRecordAssignmentsNotice')}
            className="body-small-regular"
            anchorClassName="h4"
            anchorClick={handleOpenManageAccess}
          />
        </InfoNote>
      )}

      {!isSetup && (
        <Box
          sx={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            padding: '0 4px',
            '& [role="tabpanel"]': { display: 'none' },
          }}
        >
          <Tabs tabs={tabs} value={tab} onChange={setTab} divider />

          {current.total === 0 ? (
            <NoAssignments />
          ) : (
            <AssignmentsList
              months={current.byMonth}
              resetKey={String(tab)}
              onOpen={handleOpenAssignment}
            />
          )}
        </Box>
      )}
    </Drawer>
  );
};

export default MyAssignments;
