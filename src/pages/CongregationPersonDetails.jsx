import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import dateFormat from 'dateformat';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import DeleteIcon from '@mui/icons-material/Delete';
import DevicesIcon from '@mui/icons-material/Devices';
import Fab from '@mui/material/Fab';
import FormControlLabel from '@mui/material/FormControlLabel';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import SaveIcon from '@mui/icons-material/Save';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { apiHostState, rootModalOpenState, userEmailState, visitorIDState } from '../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../states/notification';
import { congIDState } from '../states/congregation';
import { allStudentsState } from '../states/persons';

const styles = {
  checkbox: {
    paddingTop: '0 !important',
  },
};

const CongregationPersonDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const query = queryClient.getQueryData(['congPersons']);
  const person = query?.find((person) => person.id === id);

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setRootModalOpen = useSetRecoilState(rootModalOpenState);

  const userEmail = useRecoilValue(userEmailState);
  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);
  const congID = useRecoilValue(congIDState);
  const dbPersons = useRecoilValue(allStudentsState);

  const [member, setMember] = useState(person);

  const pocketOptions = person ? dbPersons.filter((student) => student.person_uid !== person.pocket_local_id) : [];

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

  const handleUpdatePocketMembers = (value) => {
    const newValue = value.map((selected) => {
      return { person_uid: selected.person_uid, person_name: selected.person_name };
    });

    setMember((prev) => {
      return { ...prev, pocket_members: newValue };
    });
  };

  const handleUpdatePocketLocalId = (value) => {
    setMember((prev) => {
      return {
        ...prev,
        pocket_local_id: value === null ? '' : { person_uid: value.person_uid, person_name: value.person_name },
      };
    });
  };

  const handleBackAdmin = () => {
    navigate('/administration');
  };

  const formatLastSeen = (last_seen) => {
    return last_seen ? dateFormat(new Date(last_seen), t('global.shortDateTimeFormat')) : '';
  };

  const handleGenerateOCode = async () => {
    try {
      if (apiHost !== '' && congID !== '') {
        setRootModalOpen(true);
        const res = await fetch(`${apiHost}api/congregations/${congID}/pockets/${id}/code`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            visitorid: visitorID,
            email: userEmail,
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
        const res = await fetch(`${apiHost}api/congregations/${congID}/pockets/${id}/code`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            visitorid: visitorID,
            email: userEmail,
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
        const res = await fetch(`${apiHost}api/congregations/${congID}/pockets/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            visitorid: visitorID,
            email: userEmail,
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

        const res = await fetch(`${apiHost}api/users/${id}/sessions`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            visitorid: visitorID,
            email: userEmail,
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

        let reqPayload = {};
        let api = '';
        if (person.global_role === 'pocket') {
          reqPayload = {
            cong_role: member.cong_role,
            pocket_members: member.pocket_members,
            pocket_local_id: member.pocket_local_id,
          };
          api = `${apiHost}api/congregations/${congID}/pockets/${person.id}`;
        } else {
          reqPayload = {
            user_role: member.cong_role,
            pocket_members: member.pocket_members,
            pocket_local_id: member.pocket_local_id,
          };
          api = `${apiHost}api/congregations/${congID}/members/${person.id}`;
        }

        const res = await fetch(api, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            visitorid: visitorID,
            email: userEmail,
          },
          body: JSON.stringify(reqPayload),
        });

        const data = await res.json();

        if (res.status === 200) {
          setRootModalOpen(false);
          queryClient.invalidateQueries({ queryKey: ['congPersons'] });
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

        const res = await fetch(`${apiHost}api/congregations/${congID}/members/${person.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            visitorid: visitorID,
            email: userEmail,
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
          <Typography sx={{ fontWeight: 'bold' }}>{t('administration.editCPEUser')}</Typography>
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
              <Box>
                <Typography variant="h5" sx={{ minWidth: '300px', fontWeight: 'bold' }}>
                  {person.username}
                </Typography>
                <Typography>{person.user_uid}</Typography>
              </Box>

              {/* Roles */}
              <Box sx={{ marginTop: '20px' }}>
                <Typography
                  sx={{ fontWeight: 'bold', marginBottom: '20px', borderBottom: '1px outset', paddingBottom: '5px' }}
                >
                  {t('global.roles')}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} lg={4} sx={styles.checkbox}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={member.cong_role?.includes('admin') || false}
                          disabled={member.global_role === 'pocket'}
                          onChange={(e) => handleCheckAdmin(e.target.checked)}
                        />
                      }
                      label={t('administration.roleAdmin')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} sx={styles.checkbox}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={member.cong_role?.includes('lmmo') || false}
                          disabled={member.global_role === 'pocket'}
                          onChange={(e) => handleCheckLMMO(e.target.checked)}
                        />
                      }
                      label={t('administration.roleLMMO')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} sx={styles.checkbox}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={member.cong_role?.includes('lmmo-backup') || false}
                          disabled={member.global_role === 'pocket'}
                          onChange={(e) => handleCheckLMMOAssistant(e.target.checked)}
                        />
                      }
                      label={t('administration.roleLMMOAssistant')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6} lg={4} sx={styles.checkbox}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={member.cong_role?.includes('view_meeting_schedule') || false}
                          onChange={(e) => handleCheckViewMeetingSchedule(e.target.checked)}
                        />
                      }
                      label={t('administration.roleViewMeetingSchedule')}
                    />
                  </Grid>
                </Grid>
              </Box>

              {/* Local records */}
              {userEmail !== person.user_uid && member.cong_role?.includes('view_meeting_schedule') && (
                <Box sx={{ marginTop: '20px' }}>
                  <Typography
                    sx={{ fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px outset', paddingBottom: '5px' }}
                  >
                    {t('persons.localRecord')}
                  </Typography>
                  <Box maxWidth={'280px'}>
                    <Autocomplete
                      id="tags-standard"
                      value={member.pocket_local_id === '' ? null : member.pocket_local_id}
                      onChange={(e, value) => handleUpdatePocketLocalId(value)}
                      options={dbPersons}
                      getOptionLabel={(option) => option.person_name}
                      isOptionEqualToValue={(option, value) => option.person_uid === value.person_uid}
                      renderInput={(params) => <TextField {...params} variant="standard" label={t('global.record')} />}
                      noOptionsText={t('assignments.noMatchRecord')}
                    />
                  </Box>
                </Box>
              )}

              {/* View Meeting Schedules for Others */}
              {member.cong_role?.includes('view_meeting_schedule') && (
                <Box sx={{ marginTop: '20px' }}>
                  <Typography
                    sx={{ fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px outset', paddingBottom: '5px' }}
                  >
                    {t('persons.viewOnBehalf')}
                  </Typography>
                  <Box>
                    <Autocomplete
                      multiple
                      id="tags-standard"
                      value={member.pocket_members}
                      onChange={(e, value) => handleUpdatePocketMembers(value)}
                      options={pocketOptions}
                      getOptionLabel={(option) => option.person_name}
                      isOptionEqualToValue={(option, value) => option.person_uid === value.person_uid}
                      renderInput={(params) => (
                        <TextField {...params} variant="standard" label={t('global.students')} />
                      )}
                      noOptionsText={t('assignments.noMatchRecord')}
                    />
                  </Box>
                </Box>
              )}

              {/* Pocket Setup */}
              {member.global_role === 'pocket' && (
                <Box sx={{ marginTop: '20px' }}>
                  <Typography
                    sx={{ fontWeight: 'bold', marginBottom: '20px', borderBottom: '1px outset', paddingBottom: '5px' }}
                  >
                    {t('administration.pocketSetupInstruction')}
                  </Typography>

                  {member.pocket_oCode !== '' && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <Typography>{t('administration.pocketSetupSite')}</Typography>
                      <Typography>{t('administration.pocketSetupCode')}</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <TextField
                          id="outlined-token"
                          variant="outlined"
                          autoComplete="off"
                          value={member.pocket_oCode}
                          sx={{ width: '250px', input: { textAlign: 'center' } }}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                        <IconButton color="error" onClick={handleDeleteOCode}>
                          <DeleteIcon sx={{ fontSize: '40px' }} />
                        </IconButton>
                      </Box>
                    </Box>
                  )}

                  {member.pocket_oCode === '' && (
                    <Button variant="contained" onClick={handleGenerateOCode}>
                      {t('administration.pocketAddDevice')}
                    </Button>
                  )}
                </Box>
              )}

              {/* Sessions or Devices */}
              <Box sx={{ marginTop: '20px' }}>
                <Typography
                  sx={{ fontWeight: 'bold', marginBottom: '20px', borderBottom: '1px outset', paddingBottom: '5px' }}
                >
                  {t('administration.sessionsDevices')}
                </Typography>

                <Grid container spacing={2}>
                  {person.global_role === 'vip' &&
                    person.sessions.map((session) => (
                      <Grid item key={session.visitorid} xs={12} lg={6}>
                        <Paper elevation={8} sx={{ padding: '10px' }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: '20px',
                            }}
                          >
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <GpsFixedIcon sx={{ fontSize: '60px', marginRight: '10px', color: '#1976d2' }} />
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>
                                  {`IP: ${session.visitor_details.ip} - ${session.visitor_details.ipLocation.country.name}`}
                                </Typography>
                                <Typography>
                                  {`${session.visitor_details.browserDetails.browserName} (${session.visitor_details.browserDetails.os} ${session.visitor_details.browserDetails.osVersion})`}
                                </Typography>
                                <Typography>
                                  {t('settings.lastSeen', { last_seen: formatLastSeen(session.sws_last_seen) })}
                                </Typography>
                                {visitorID === session.visitorid && (
                                  <Box>
                                    <Chip
                                      label={t('settings.currentSession')}
                                      sx={{
                                        backgroundColor: '#145A32',
                                        color: 'white',
                                        fontWeight: 'bold',
                                      }}
                                    />
                                  </Box>
                                )}
                              </Box>
                            </Box>
                            {visitorID !== session.visitorid && (
                              <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
                                <Button
                                  variant="outlined"
                                  color="error"
                                  sx={{ marginBottom: '10px' }}
                                  onClick={() => handleRevokeSession(session.visitorid)}
                                >
                                  {t('settings.sessionRevoke')}
                                </Button>
                              </Box>
                            )}
                          </Box>
                        </Paper>
                      </Grid>
                    ))}

                  {person.global_role === 'pocket' &&
                    person.pocket_devices.map((device) => (
                      <Grid item key={device.visitorid} xs={12} md={6}>
                        <Paper elevation={8} sx={{ padding: '10px' }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              flexWrap: 'wrap',
                              gap: '20px',
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <DevicesIcon
                                sx={{
                                  fontSize: '60px',
                                  marginRight: '10px',
                                  color: '#1976d2',
                                }}
                              />
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                <Typography sx={{ fontSize: '14px' }}>{device.name}</Typography>
                                <Box>
                                  <Chip
                                    label={formatLastSeen(device.sws_last_seen)}
                                    sx={{
                                      backgroundColor: '#1976d2',
                                      color: 'white',
                                      fontWeight: 'bold',
                                    }}
                                  />
                                </Box>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', flexGrow: 1, justifyContent: 'flex-end' }}>
                              <Button
                                variant="outlined"
                                color="error"
                                sx={{ marginBottom: '10px' }}
                                onClick={() => handleDeleteDevice(device.visitorid)}
                              >
                                {t('settings.sessionRevoke')}
                              </Button>
                            </Box>
                          </Box>
                        </Paper>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Box sx={{ '& > :not(style)': { m: 1 }, position: 'fixed', bottom: 20, right: 20 }}>
        {person.global_role === 'vip' && (
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
