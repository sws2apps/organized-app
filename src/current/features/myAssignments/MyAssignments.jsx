import { useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Typography from '@mui/material/Typography';
import MyAssignmentsList from './MyAssignmentsList';
import MyAssignmentsSetup from './MyAssignmentsSetup';
import { isMyAssignmentOpenState, refreshMyAssignmentsState, userLocalUidState } from '../../states/main';
import { Setting } from '../../classes/Setting';

const MyAssignments = () => {
  const { t } = useTranslation('ui');

  const [drawerOpen, setDrawerOpen] = useRecoilState(isMyAssignmentOpenState);
  const setRefresh = useSetRecoilState(refreshMyAssignmentsState);

  const userLocalUid = useRecoilValue(userLocalUidState);

  const [overrideEdit, setOverrideEdit] = useState(false);

  const accountType = Setting.account_type;
  const lmmoRole = Setting.cong_role.includes('lmmo') || Setting.cong_role.includes('lmmo-backup');
  const secretaryRole = Setting.cong_role.includes('secretary');
  const isEditAllowed = lmmoRole || secretaryRole;

  const handleRefresh = () => {
    setRefresh((prev) => {
      return !prev;
    });
  };

  const toggleDrawer = (open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setDrawerOpen(open);
  };

  return (
    <SwipeableDrawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
      <Box
        sx={{
          paddingTop: '50px',
          borderBottom: '1px outset',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography sx={{ padding: '20px', textTransform: 'uppercase', fontWeight: 'bold' }}>
          {t('viewMyAssignments')}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginRight: '20px' }}>
          {isEditAllowed && userLocalUid !== '' && (
            <IconButton color="primary" aria-label="close" onClick={() => setOverrideEdit(true)}>
              <EditIcon sx={{ fontSize: '30px' }} />
            </IconButton>
          )}
          <IconButton color="success" aria-label="close" onClick={handleRefresh}>
            <AutorenewIcon sx={{ fontSize: '30px' }} />
          </IconButton>
          <IconButton color="error" aria-label="close" onClick={() => setDrawerOpen(false)}>
            <CloseIcon sx={{ fontSize: '30px' }} />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ minWidth: '350px', maxWidth: '650px', padding: '20px' }}>
        {accountType === 'vip' && (
          <>
            {isEditAllowed && (
              <>
                {(userLocalUid === '' || overrideEdit) && (
                  <MyAssignmentsSetup overrideEdit={overrideEdit} setOverrideEdit={(value) => setOverrideEdit(value)} />
                )}
                {userLocalUid !== '' && !overrideEdit && <MyAssignmentsList />}
              </>
            )}
            {!isEditAllowed && userLocalUid !== '' && <MyAssignmentsList />}
          </>
        )}

        {accountType === 'pocket' && userLocalUid !== '' && <MyAssignmentsList />}
      </Box>
    </SwipeableDrawer>
  );
};

export default MyAssignments;
