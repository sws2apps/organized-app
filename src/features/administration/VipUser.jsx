import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import dateFormat from 'dateformat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LabelIcon from '@mui/icons-material/Label';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { VipUserDelete } from './';
import { apiHostState, rootModalOpenState, userEmailState, visitorIDState } from '../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { congIDState } from '../../states/congregation';

const roleStyles = {
  fontSize: '14px',
};

const VipUser = ({ member, setMembers }) => {
  const queryClient = useQueryClient();

  const cancel = useRef();

  const navigate = useNavigate();

  const { t } = useTranslation();

  const setModalOpen = useSetRecoilState(rootModalOpenState);
  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const userEmail = useRecoilValue(userEmailState);
  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);
  const congID = useRecoilValue(congIDState);

  const [isDelete, setIsDelete] = useState(false);

  const lastSeen = member.last_seen
    ? dateFormat(new Date(member.last_seen), t('global.shortDateTimeFormat'))
    : t('administration.notConnected');

  const handleEditMember = () => {
    navigate(`/administration/members/${member.id}`);
  };

  const handleInitDelete = () => {
    setIsDelete(true);
  };

  const deleteUser = async () => {
    try {
      if (apiHost !== '') {
        cancel.current = false;

        setIsDelete(false);
        setModalOpen(true);

        const res = await fetch(`${apiHost}api/congregations/${congID}/members/${member.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            visitorid: visitorID,
            email: userEmail,
          },
        });

        if (!cancel.current) {
          const data = await res.json();

          if (res.status === 200) {
            setMembers(data);
            setModalOpen(false);

            queryClient.invalidateQueries({ queryKey: ['vipUsers'] });
            return;
          }

          setModalOpen(false);
          setAppMessage(data.message);
          setAppSeverity('warning');
          setAppSnackOpen(true);
        }
      }
    } catch (err) {
      if (!cancel.current) {
        setIsDelete(false);
        setModalOpen(false);
        setAppMessage(err.message);
        setAppSeverity('error');
        setAppSnackOpen(true);
      }
    }
  };

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, [cancel]);

  return (
    <Paper elevation={4} sx={{ padding: '20px', marginBottom: '20px' }}>
      <VipUserDelete
        isDelete={isDelete}
        setIsDelete={(value) => setIsDelete(value)}
        deleteUser={deleteUser}
        name={member.name}
      />
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '15px',
            width: '350px',
          }}
        >
          <AccountCircleIcon color="primary" sx={{ fontSize: '40px', marginRight: '10px' }} />
          <Box>
            <Typography sx={{ fontWeight: 'bold' }}>{member.name}</Typography>
            <Typography sx={{ fontSize: '13px' }}>{member.user_uid}</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            marginBottom: '15px',
            width: '200px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Chip
            label={lastSeen}
            sx={{
              backgroundColor: `${member.last_seen ? '#0E6655' : ''}`,
              color: 'white',
              fontWeight: 'bold',
            }}
          />
        </Box>
        <Box sx={{ paddingLeft: '50px' }}>
          {member.role.includes('admin') && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <LabelIcon sx={{ fontSize: '15px', marginRight: '5px', marginTop: '3px' }} />
              <Typography sx={roleStyles}>{t('administration.roleAdmin')}</Typography>
            </Box>
          )}
          {member.role.includes('lmmo') && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <LabelIcon sx={{ fontSize: '15px', marginRight: '5px', marginTop: '3px' }} />
              <Typography sx={roleStyles}>{t('administration.roleLMMO')}</Typography>
            </Box>
          )}
          {member.role.includes('lmmo-backup') && (
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <LabelIcon sx={{ fontSize: '15px', marginRight: '5px', marginTop: '3px' }} />
              <Typography sx={roleStyles}>{t('administration.roleLMMOAssistant')}</Typography>
            </Box>
          )}
        </Box>
      </Box>
      <Box sx={{ margin: '10px 0 0 40px' }}>
        <Button variant="outlined" sx={{ marginRight: '5px' }} startIcon={<EditIcon />} onClick={handleEditMember}>
          {t('global.edit')}
        </Button>
        <Button color="error" variant="outlined" startIcon={<DeleteIcon />} onClick={handleInitDelete}>
          {t('global.delete')}
        </Button>
      </Box>
    </Paper>
  );
};

export default VipUser;
