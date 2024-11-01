import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Box from '@mui/material/Box';
import Fab from '@mui/material/Fab';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SaveIcon from '@mui/icons-material/Save';
import Typography from '@mui/material/Typography';
import useFirebaseAuth from '../hooks/useFirebaseAuth';
import {
  CongregationPersonBasic,
  CongregationPersonDelegates,
  CongregationPersonLocalRecord,
  CongregationPersonPocketDevice,
  CongregationPersonPocketSetup,
  CongregationPersonRoles,
  CongregationPersonVipDevice,
} from '../features/congregationPersons';
import { Setting } from '../classes/Setting';
import { apiHostState, rootModalOpenState, visitorIDState } from '../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';
import { congIDState } from '../states/congregation';

const CongregationPersonDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation('ui');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const query = queryClient.getQueryData(['congPersons']);
  const person = query?.find((person) => person.id === id);

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setRootModalOpen = useSetRecoilState(rootModalOpenState);

  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);
  const congID = useRecoilValue(congIDState);

  const { user } = useFirebaseAuth();

  const [member, setMember] = useState(person);

  const handleCheckAdmin = (value) => {
    let role = [];
    if (value) {
      role = ['admin', ...member.cong_role];
    } else {
      role = member.cong_role.filter((role) => role !== 'admin');
    }

    setMember((prev) => {
      return { ...prev, cong_role: role };
    });
  };

  const handleCheckSecretary = (value) => {
    let role = [];
    if (value) {
      role = [...member.cong_role, 'secretary'];
    } else {
      role = member.cong_role.filter((role) => role !== 'secretary');
    }

    setMember((prev) => {
      return { ...prev, cong_role: role };
    });
  };

  const handleCheckLMMO = (value) => {
    let role = [];
    if (value) {
      role = [...member.cong_role, 'lmmo'];
    } else {
      role = member.cong_role.filter((role) => role !== 'lmmo');
    }

    setMember((prev) => {
      return { ...prev, cong_role: role };
    });
  };

  const handleCheckLMMOAssistant = (value) => {
    let role = [];
    if (value) {
      role = [...member.cong_role, 'lmmo-backup'];
    } else {
      role = member.cong_role.filter((role) => role !== 'lmmo-backup');
    }

    setMember((prev) => {
      return { ...prev, cong_role: role };
    });
  };

  const handleCheckPublicTalkCoordinator = (value) => {
    let role = [];
    if (value) {
      role = [...member.cong_role, 'public_talk_coordinator'];
    } else {
      role = member.cong_role.filter((role) => role !== 'public_talk_coordinator');
    }

    setMember((prev) => {
      return { ...prev, cong_role: role };
    });
  };

  const handleCheckCoordinator = (value) => {
    let role = [];
    if (value) {
      role = [...member.cong_role, 'coordinator'];
    } else {
      role = member.cong_role.filter((role) => role !== 'coordinator');
    }

    setMember((prev) => {
      return { ...prev, cong_role: role };
    });
  };

  const handleCheckViewMeetingSchedule = (value) => {
    let role = [];
    if (value) {
      role = [...member.cong_role, 'view_meeting_schedule'];
    } else {
      role = member.cong_role.filter((role) => role !== 'view_meeting_schedule');
    }

    setMember((prev) => {
      return { ...prev, cong_role: role };
    });
  };

  const handleUpdatePocketCode = (value) => {
    setMember((prev) => {
      return { ...prev, pocket_oCode: value };
    });
  };

  const handleUpdatePocketDevices = (value) => {
    setMember((prev) => {
      return { ...prev, pocket_devices: value };
    });
  };

  const handleUpdateUserSessions = (value) => {
    setMember((prev) => {
      return { ...prev, sessions: value };
    });
  };

  const handleUpdateUserDelegate = (value) => {
    const newValue = value.map((selected) => {
      return { person_uid: selected.user_local_uid };
    });

    setMember((prev) => {
      return { ...prev, user_members_delegate: newValue };
    });
  };

  const handleUpdatePocketLocalId = (value) => {
    setMember((prev) => {
      return {
        ...prev,
        user_local_uid: value === null ? '' : value.person_uid,
      };
    });
  };

  const handleBackAdmin = () => {
    navigate('/administration');
  };

  const handleGenerateOCode = async () => {
    try {
      if (apiHost !== '' && congID !== '') {
        setRootModalOpen(true);
        const res = await fetch(`${apiHost}api/v2/congregations/admin/${congID}/pockets/${id}/code`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            appclient: 'cpe',
            appversion: import.meta.env.PACKAGE_VERSION,
            visitorid: visitorID,
            uid: user.uid,
          },
        });

        const data = await res.json();

        if (res.status === 200) {
          handleUpdatePocketCode(data.code);
          queryClient.invalidateQueries({ queryKey: ['congPersons'] });
        } else {
          setAppMessage(data.message);
          setAppSeverity('warning');
          setAppSnackOpen(true);
        }

        setRootModalOpen(false);
      }
    } catch (err) {
      setRootModalOpen(false);
      setAppMessage(err.message);
      setAppSeverity('error');
      setAppSnackOpen(true);
    }
  };

  const handleDeleteOCode = async () => {
    try {
      if (apiHost !== '' && congID !== '') {
        setRootModalOpen(true);
        const res = await fetch(`${apiHost}api/v2/congregations/admin/${congID}/pockets/${id}/code`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            appclient: 'cpe',
            appversion: import.meta.env.PACKAGE_VERSION,
            visitorid: visitorID,
            uid: user.uid,
          },
        });

        const data = await res.json();

        if (res.status === 200) {
          queryClient.invalidateQueries({ queryKey: ['congPersons'] });
          if (data.message === 'POCKET_CODE_REMOVED') {
            handleUpdatePocketCode('');
          } else {
            navigate('/administration');
          }
        } else {
          setAppMessage(data.message);
          setAppSeverity('warning');
          setAppSnackOpen(true);
        }

        setRootModalOpen(false);
      }
    } catch (err) {
      setRootModalOpen(false);
      setAppMessage(err.message);
      setAppSeverity('error');
      setAppSnackOpen(true);
    }
  };

  const handleDeleteDevice = async (pocket_visitorid) => {
    try {
      if (apiHost !== '' && congID !== '') {
        setRootModalOpen(true);
        const res = await fetch(`${apiHost}api/v2/congregations/admin/${congID}/pockets/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            appclient: 'cpe',
            appversion: import.meta.env.PACKAGE_VERSION,
            visitorid: visitorID,
            uid: user.uid,
          },
          body: JSON.stringify({ pocket_visitorid }),
        });

        const data = await res.json();

        if (res.status === 200) {
          queryClient.invalidateQueries({ queryKey: ['congPersons'] });

          if (data.devices) {
            handleUpdatePocketDevices(data.devices);
          }

          if (data.message === 'POCKET_USER_DELETED') {
            navigate('/administration');
          }

          setRootModalOpen(false);

          return;
        }

        setRootModalOpen(false);
        setAppMessage(data.message);
        setAppSeverity('warning');
        setAppSnackOpen(true);
      }
    } catch (err) {
      setRootModalOpen(false);
      setAppMessage(err.message);
      setAppSeverity('error');
      setAppSnackOpen(true);
    }
  };

  const handleRevokeSession = async (visitorid) => {
    try {
      if (apiHost !== '') {
        setRootModalOpen(true);

        const res = await fetch(`${apiHost}api/v2/users/${id}/sessions`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            appclient: 'cpe',
            appversion: import.meta.env.PACKAGE_VERSION,
            visitorid: visitorID,
            uid: user.uid,
          },
          body: JSON.stringify({ session: visitorid }),
        });

        const data = await res.json();

        if (res.status === 200) {
          setRootModalOpen(false);
          handleUpdateUserSessions(data);
          return;
        }

        setRootModalOpen(false);
        setAppMessage(data.message);
        setAppSeverity('warning');
        setAppSnackOpen(true);
      }
    } catch (err) {
      setRootModalOpen(false);
      setAppMessage(err.message);
      setAppSeverity('error');
      setAppSnackOpen(true);
    }
  };

  const handleSaveCongPerson = async () => {
    try {
      if (apiHost !== '' && congID !== '') {
        setRootModalOpen(true);

        const reqPayload = {
          user_role: member.cong_role,
          user_members_delegate: member.user_members_delegate,
          user_local_uid: member.user_local_uid,
        };

        let api = '';
        if (person.global_role === 'pocket') {
          api = `${apiHost}api/v2/congregations/admin/${congID}/pockets/${person.id}`;
        } else {
          api = `${apiHost}api/v2/congregations/admin/${congID}/members/${person.id}`;
        }

        const res = await fetch(api, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            appclient: 'cpe',
            appversion: import.meta.env.PACKAGE_VERSION,
            visitorid: visitorID,
            uid: user.uid,
          },
          body: JSON.stringify(reqPayload),
        });

        const data = await res.json();

        if (res.status === 200) {
          setRootModalOpen(false);
          queryClient.invalidateQueries({ queryKey: ['congPersons'] });

          if (user.email === person.user_uid) {
            await Setting.update({ user_members_delegate: member.user_members_delegate, cong_role: member.cong_role });
            window.location.reload();
          }
          return;
        }

        setRootModalOpen(false);
        setAppMessage(data.message);
        setAppSeverity('warning');
        setAppSnackOpen(true);
      }
    } catch (err) {
      setRootModalOpen(false);
      setAppMessage(err.message);
      setAppSeverity('error');
      setAppSnackOpen(true);
    }
  };

  const handleRemoveCongPerson = async () => {
    try {
      if (apiHost !== '' && congID !== '') {
        setRootModalOpen(true);

        const res = await fetch(`${apiHost}api/v2/congregations/admin/${congID}/members/${person.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            appclient: 'cpe',
            appversion: import.meta.env.PACKAGE_VERSION,
            visitorid: visitorID,
            uid: user.uid,
          },
        });

        const data = await res.json();

        if (res.status === 200) {
          setRootModalOpen(false);
          queryClient.invalidateQueries({ queryKey: ['congPersons'] });
          navigate('/administration');
          return;
        }

        setRootModalOpen(false);
        setAppMessage(data.message);
        setAppSeverity('warning');
        setAppSnackOpen(true);
      }
    } catch (err) {
      setRootModalOpen(false);
      setAppMessage(err.message);
      setAppSeverity('error');
      setAppSnackOpen(true);
    }
  };

  if (!person) return <Navigate to="/administration" />;

  return (
    <Box>
      <Box sx={{ marginBottom: '100px' }}>
        <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <IconButton onClick={handleBackAdmin}>
            <ArrowBackIcon sx={{ fontSize: '30px' }} />
          </IconButton>
          <Typography sx={{ fontWeight: 'bold' }}>{t('editCPEUser')}</Typography>
        </Box>

        <Box sx={{ marginTop: '20px' }}>
          <Box
            sx={{
              display: 'flex',
              gap: '10px',
            }}
          >
            <AccountCircleIcon
              color={person.global_role === 'vip' ? 'primary' : 'secondary'}
              sx={{ fontSize: '50px' }}
            />

            <Box sx={{ flexGrow: 1 }}>
              {/* Name and Email */}
              <CongregationPersonBasic person={person} />
            </Box>
          </Box>

          <Box sx={{ padding: '0 10px' }}>
            {/* Roles */}
            <CongregationPersonRoles
              member={member}
              handleCheckAdmin={(value) => handleCheckAdmin(value)}
              handleCheckLMMO={(value) => handleCheckLMMO(value)}
              handleCheckLMMOAssistant={(value) => handleCheckLMMOAssistant(value)}
              handleCheckSecretary={(value) => handleCheckSecretary(value)}
              handleCheckViewMeetingSchedule={(value) => handleCheckViewMeetingSchedule(value)}
              handleCheckPublicTalkCoordinator={handleCheckPublicTalkCoordinator}
              handleCheckCoordinator={handleCheckCoordinator}
            />

            {/* Local records */}
            <CongregationPersonLocalRecord
              member={member}
              handleUpdatePocketLocalId={(value) => handleUpdatePocketLocalId(value)}
            />

            {/* View Meeting Schedules for Others */}
            <CongregationPersonDelegates
              member={member}
              person={person}
              handleUpdateUserDelegate={(value) => handleUpdateUserDelegate(value)}
            />

            {/* Pocket Setup */}
            {member.global_role === 'pocket' && (
              <CongregationPersonPocketSetup
                member={member}
                handleDeleteOCode={handleDeleteOCode}
                handleGenerateOCode={handleGenerateOCode}
              />
            )}

            {/* Sessions or Devices */}
            <Box sx={{ marginTop: '20px' }}>
              <Typography
                sx={{ fontWeight: 'bold', marginBottom: '20px', borderBottom: '1px outset', paddingBottom: '5px' }}
              >
                {t('sessionsDevices')}
              </Typography>

              <Grid container spacing={2}>
                {person.global_role === 'vip' &&
                  person.sessions &&
                  person.sessions.map((session) => (
                    <CongregationPersonVipDevice
                      key={session.visitorid}
                      session={session}
                      handleRevokeSession={(value) => handleRevokeSession(value)}
                    />
                  ))}

                {person.global_role === 'pocket' &&
                  person.pocket_devices.map((device) => (
                    <CongregationPersonPocketDevice
                      key={device.visitorid}
                      device={device}
                      handleDeleteDevice={(value) => handleDeleteDevice(value)}
                    />
                  ))}
              </Grid>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ '& > :not(style)': { m: 1 }, position: 'fixed', bottom: 20, right: 20 }}>
        {user && person.global_role === 'vip' && user.email !== person.user_uid && (
          <Fab aria-label="save" color="error" onClick={handleRemoveCongPerson}>
            <PersonRemoveIcon />
          </Fab>
        )}
        <Fab aria-label="save" color="primary" onClick={handleSaveCongPerson}>
          <SaveIcon />
        </Fab>
      </Box>
    </Box>
  );
};

export default CongregationPersonDetails;
