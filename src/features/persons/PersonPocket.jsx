import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { useEffect, useRef, useState } from 'react';
import dateFormat from 'dateformat';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Chip from '@mui/material/Chip';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import DevicesIcon from '@mui/icons-material/Devices';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { apiHostState, userEmailState, visitorIDState } from '../../states/main';
import { congIDState } from '../../states/congregation';
import { allStudentsState } from '../../states/persons';
import { dbGetStudentDetailsMini } from '../../indexedDb/dbPersons';

const PersonPocket = ({ id, name }) => {
  const { t } = useTranslation();

  let cancel = useRef();

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const userEmail = useRecoilValue(userEmailState);
  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);
  const congID = useRecoilValue(congIDState);
  const dbStudents = useRecoilValue(allStudentsState);

  const [isGettingUser, setIsGettingUser] = useState(true);
  const [devices, setDevices] = useState([]);
  const [verifyCode, setVerifyCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [pocketName, setPocketName] = useState('');
  const [pocketMembers, setPocketMembers] = useState([]);
  const [pocketOptions, setPocketOptions] = useState([]);
  const [value, setValue] = useState([]);

  const handleUpdatePocketUsername = async () => {
    try {
      if (apiHost !== '') {
        cancel.current = false;
        setIsGenerating(true);
        const res = await fetch(`${apiHost}api/congregations/${congID}/pockets/${id}/username`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            visitorid: visitorID,
            email: userEmail,
          },
          body: JSON.stringify({ username: name }),
        });

        if (!cancel.current) {
          const data = await res.json();

          if (res.status === 200) {
            setPocketName(data.username);
            setIsGenerating(false);
            return;
          }

          setIsGenerating(false);
          setAppMessage(data.message);
          setAppSeverity('warning');
          setAppSnackOpen(true);
        }
      }
    } catch (err) {
      if (!cancel.current) {
        setIsGenerating(false);
        setAppMessage(err.message);
        setAppSeverity('error');
        setAppSnackOpen(true);
      }
    }
  };

  const handleSetupPocket = async () => {
    try {
      if (apiHost !== '') {
        cancel.current = false;
        setIsGenerating(true);
        setVerifyCode('');
        const res = await fetch(`${apiHost}api/congregations/${congID}/pockets/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            visitorid: visitorID,
            email: userEmail,
          },
          body: JSON.stringify({ username: name }),
        });

        if (!cancel.current) {
          const data = await res.json();

          if (res.status === 200) {
            setVerifyCode(data.code);
            setPocketName(data.username);
            setIsGenerating(false);
            return;
          }

          setIsGenerating(false);
          setAppMessage(data.message);
          setAppSeverity('warning');
          setAppSnackOpen(true);
        }
      }
    } catch (err) {
      if (!cancel.current) {
        setIsGenerating(false);
        setAppMessage(err.message);
        setAppSeverity('error');
        setAppSnackOpen(true);
      }
    }
  };

  const handleGenerateOCode = async () => {
    try {
      if (apiHost !== '' && congID !== '') {
        cancel.current = false;

        setIsGenerating(true);
        setVerifyCode('');
        const res = await fetch(`${apiHost}api/congregations/${congID}/pockets/${id}/code`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            visitorid: visitorID,
            email: userEmail,
          },
        });

        if (!cancel.current) {
          const data = await res.json();

          if (res.status === 200) {
            setVerifyCode(data.code);
            setIsGenerating(false);
            return;
          }

          setIsGenerating(false);
          setAppMessage(data.message);
          setAppSeverity('warning');
          setAppSnackOpen(true);
        }
      }
    } catch (err) {
      if (!cancel.current) {
        setIsGenerating(false);
        setAppMessage(err.message);
        setAppSeverity('error');
        setAppSnackOpen(true);
      }
    }
  };

  const handleDeleteDevice = async (pocket_visitorid) => {
    try {
      if (apiHost !== '' && congID !== '') {
        cancel.current = false;

        setIsGenerating(true);
        const res = await fetch(`${apiHost}api/congregations/${congID}/pockets/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            visitorid: visitorID,
            email: userEmail,
          },
          body: JSON.stringify({ pocket_visitorid }),
        });

        if (!cancel.current) {
          const data = await res.json();

          if (res.status === 200) {
            if (data.devices) {
              setDevices(data.devices);
            }

            if (data.message === 'POCKET_USER_DELETED') {
              setPocketName('');
              setIsGettingUser(false);
              setDevices([]);
            }

            setIsGenerating(false);

            return;
          }

          setIsGenerating(false);
          setAppMessage(data.message);
          setAppSeverity('warning');
          setAppSnackOpen(true);
        }
      }
    } catch (err) {
      if (!cancel.current) {
        setIsGenerating(false);
        setAppMessage(err.message);
        setAppSeverity('error');
        setAppSnackOpen(true);
      }
    }
  };

  const handleUpdatePocketMembers = async () => {
    try {
      if (apiHost !== '' && congID !== '') {
        cancel.current = false;
        setIsGenerating(true);

        const members = value.map((member) => {
          return {
            person_uid: member.person_uid,
            person_name: member.person_name,
          };
        });

        const res = await fetch(`${apiHost}api/congregations/${congID}/pockets/${id}/members`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            visitorid: visitorID,
            email: userEmail,
          },
          body: JSON.stringify({ members }),
        });

        if (!cancel.current) {
          const data = await res.json();

          if (res.status === 200) {
            setPocketMembers(data.pocket_members);
            setIsGenerating(false);
            return;
          }

          setIsGenerating(false);
          setAppMessage(data.message);
          setAppSeverity('warning');
          setAppSnackOpen(true);
        }
      }
    } catch (err) {
      if (!cancel.current) {
        setIsGenerating(false);
        setAppMessage(err.message);
        setAppSeverity('error');
        setAppSnackOpen(true);
      }
    }
  };

  useEffect(() => {
    const fetchPocketUser = async () => {
      try {
        if (apiHost !== '' && congID !== '') {
          cancel.current = false;

          setIsGenerating(false);
          setIsGettingUser(true);
          setDevices([]);
          setVerifyCode('');
          setPocketName('');

          const res = await fetch(`${apiHost}api/congregations/${congID}/pockets/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              visitorid: visitorID,
              email: userEmail,
            },
          });

          if (!cancel.current) {
            const data = await res.json();

            if (res.status === 200) {
              setDevices(data.pocket_devices);
              setVerifyCode(data.pocket_oCode);
              setPocketName(data.username);
              setPocketMembers(data.pocket_members);
              setIsGettingUser(false);
              return;
            }

            if (data.message === 'POCKET_NOT_FOUND') {
              setIsGettingUser(false);
              return;
            }

            setIsGettingUser(false);
            setAppMessage(data.message);
            setAppSeverity('warning');
            setAppSnackOpen(true);
          }
        }
      } catch (err) {
        if (!cancel.current) {
          setIsGettingUser(false);
          setAppMessage(err.message);
          setAppSeverity('error');
          setAppSnackOpen(true);
        }
      }
    };

    fetchPocketUser();
  }, [apiHost, cancel, congID, id, setAppMessage, setAppSeverity, setAppSnackOpen, userEmail, visitorID]);

  useEffect(() => {
    const options = dbStudents.filter((student) => student.person_uid !== id);
    setPocketOptions(options);
  }, [dbStudents, id]);

  useEffect(() => {
    const updateValue = async () => {
      let newValue = [];

      for (let i = 0; i < pocketMembers.length; i++) {
        const { person_uid } = pocketMembers[i];
        const person = await dbGetStudentDetailsMini(person_uid);

        newValue.push(person);
      }

      setValue(newValue);
    };

    updateValue();
  }, [pocketMembers]);

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, []);

  return (
    <Box>
      {isGettingUser && (
        <CircularProgress
          color="secondary"
          size={40}
          disableShrink={true}
          sx={{
            display: 'flex',
            margin: '10px auto',
          }}
        />
      )}
      {!isGettingUser && (
        <>
          {pocketName.length > 0 && (
            <Box
              sx={{
                marginBottom: '10px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography sx={{ fontWeight: 'bold', marginRight: '5px' }}>{pocketName}</Typography>
              {name !== pocketName && (
                <IconButton onClick={handleUpdatePocketUsername} disabled={isGenerating}>
                  <CloudSyncIcon color="primary" />
                </IconButton>
              )}
            </Box>
          )}
          {verifyCode.length === 0 && devices.length === 0 && (
            <Button
              variant="contained"
              sx={{ marginBottom: '15px' }}
              disabled={isGenerating}
              onClick={handleSetupPocket}
            >
              {t('persons.setupPocketAccess')}
            </Button>
          )}
          {verifyCode.length === 0 && devices.length > 0 && (
            <Button
              variant="contained"
              sx={{ marginBottom: '15px' }}
              disabled={isGenerating}
              onClick={handleGenerateOCode}
            >
              {t('persons.addPocketDevice')}
            </Button>
          )}
          {!isGettingUser && verifyCode.length > 0 && (
            <Box sx={{ marginBottom: '15px', marginTop: '10px' }}>
              <Typography>{t('persons.setupPocketToken')}</Typography>
              <TextField
                id="outlined-token"
                variant="outlined"
                size="small"
                autoComplete="off"
                value={verifyCode}
                multiline
                sx={{ width: '150px', marginTop: '5px' }}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Box>
          )}
          {devices.length > 0 && (
            <>
              <Box sx={{ margin: '10px 0 20px 0' }}>
                <Typography sx={{ fontWeight: 'bold', lineHeight: 1.2 }}>{t('persons.pocketDevices')}</Typography>
                <Typography sx={{ lineHeight: 1.2, margin: '10px 0' }}>{t('persons.pocketSessions')}</Typography>
                <Divider />
                {devices.map((device) => (
                  <Box
                    key={device.visitorid}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '10px',
                      borderBottom: '1px outset',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      maxWidth: '650px',
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginBottom: '10px',
                      }}
                    >
                      <DevicesIcon
                        sx={{
                          fontSize: '60px',
                          marginRight: '10px',
                          color: '#1976d2',
                        }}
                      />
                      <Box>
                        <Typography sx={{ fontSize: '14px' }}>{device.name}</Typography>
                        <Chip
                          label={dateFormat(new Date(device.sws_last_seen), t('global.shortDateTimeFormat'))}
                          sx={{
                            backgroundColor: '#1976d2',
                            color: 'white',
                            fontWeight: 'bold',
                          }}
                        />
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        flexGrow: 1,
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Button
                        variant="outlined"
                        color="error"
                        sx={{ marginBottom: '10px' }}
                        onClick={() => handleDeleteDevice(device.visitorid)}
                        disabled={isGenerating}
                      >
                        {t('settings.sessionRevoke')}
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            </>
          )}
          {isGenerating && (
            <CircularProgress
              color="secondary"
              size={30}
              disableShrink={true}
              sx={{
                margin: '10px 0 20px 10px',
                display: 'flex',
                alignItems: 'center',
              }}
            />
          )}

          {pocketName.length > 0 && (
            <Box>
              <Autocomplete
                multiple
                id="tags-standard"
                value={value}
                onChange={(e, value) => setValue(value)}
                options={pocketOptions}
                getOptionLabel={(option) => option.person_name}
                disabled={isGenerating}
                isOptionEqualToValue={(option, value) => option.person_uid === value.person_uid}
                renderInput={(params) => <TextField {...params} variant="standard" label={t('persons.viewOnBehalf')} />}
              />
              <Button
                sx={{ marginTop: '10px' }}
                variant="outlined"
                disabled={isGenerating}
                onClick={handleUpdatePocketMembers}
              >
                {t('global.update')}
              </Button>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default PersonPocket;
