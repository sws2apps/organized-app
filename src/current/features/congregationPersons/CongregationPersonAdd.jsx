import { useEffect, useRef, useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DoNotTouchIcon from '@mui/icons-material/DoNotTouch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import InfoIcon from '@mui/icons-material/Info';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import TextField from '@mui/material/TextField';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import Typography from '@mui/material/Typography';
import { apiHostState, isCongPersonAddState, rootModalOpenState, visitorIDState } from '../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { congIDState } from '../../states/congregation';
import useFirebaseAuth from '../../hooks/useFirebaseAuth';
import { Persons } from '../../classes/Persons';

const CongregationPersonAdd = () => {
  const abortCont = useRef();
  const queryClient = useQueryClient();
  const { t } = useTranslation('ui');

  const congMembers = queryClient.getQueryData(['congPersons']);

  const [open, setOpen] = useRecoilState(isCongPersonAddState);

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setRootModalOpen = useSetRecoilState(rootModalOpenState);

  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);
  const congID = useRecoilValue(congIDState);

  const { user } = useFirebaseAuth();

  const [value, setValue] = useState('vip');
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNoFound] = useState(false);
  const [found, setFound] = useState(false);
  const [isMember, setIsMember] = useState(false);
  const [foundMember, setFoundMember] = useState({});
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [selectedPocket, setSelectedPocket] = useState(null);

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearch = async () => {
    try {
      if (apiHost !== '' && search !== '') {
        abortCont.current = new AbortController();

        setNoFound(false);
        setFound(false);
        setIsMember(false);
        setIsSearching(true);

        const res = await fetch(`${apiHost}api/congregations/admin/${congID}/members/find?search=${search}`, {
          signal: abortCont.current.signal,
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
          if (data.message) {
            setIsMember(true);
          } else {
            setFoundMember(data);
            setFound(true);
          }
        } else if (res.status === 404) {
          setNoFound(true);
        } else {
          setAppMessage(data.message);
          setAppSeverity('warning');
          setAppSnackOpen(true);
        }

        setIsSearching(false);
      }
    } catch (err) {
      if (!abortCont.current.signal.aborted) {
        setIsSearching(false);
        setAppMessage(err.message);
        setAppSeverity('error');
        setAppSnackOpen(true);
      }
    }
  };

  const handleCreateCongPerson = async () => {
    try {
      if (apiHost !== '') {
        abortCont.current = new AbortController();

        setRootModalOpen(true);

        let api;
        let body;

        if (selectedPocket) {
          api = `${apiHost}api/congregations/admin/${congID}/pockets`;
          body = JSON.stringify({
            username: selectedPocket.person_name,
            user_local_uid: selectedPocket.person_uid,
          });
        } else {
          api = `${apiHost}api/congregations/admin/${congID}/members`;
          body = JSON.stringify({ user_id: foundMember.id });
        }

        const res = await fetch(api, {
          method: 'PUT',
          signal: abortCont.current.signal,
          headers: {
            'Content-Type': 'application/json',
            appclient: 'cpe',
            appversion: import.meta.env.PACKAGE_VERSION,
            visitorid: visitorID,
            uid: user.uid,
          },
          body,
        });

        const data = await res.json();

        if (res.status === 200) {
          setRootModalOpen(false);
          queryClient.invalidateQueries({ queryKey: ['congPersons'] });
          setOpen(false);
          return;
        }

        setRootModalOpen(false);
        setAppMessage(data.message);
        setAppSeverity('warning');
        setAppSnackOpen(true);
      }
    } catch (err) {
      if (!abortCont.current.signal.aborted) {
        setRootModalOpen(false);
        setAppMessage(err.message);
        setAppSeverity('error');
        setAppSnackOpen(true);
      }
    }
  };

  useEffect(() => {
    let newMembers = Persons.list;
    congMembers.forEach((member) => {
      newMembers = newMembers.filter((item) => item.person_uid !== member.user_local_uid);
    });
    setFilteredPersons(newMembers);
  }, [congMembers]);

  useEffect(() => {
    return () => {
      if (abortCont.current) abortCont.current.abort();
    };
  }, [abortCont]);

  return (
    <Box>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" sx={{ lineHeight: 1.3 }}>
          {t('addCPEUser')}
        </DialogTitle>
        <DialogContent>
          <Box>
            <FormControl sx={{ borderBottom: '1px outset', paddingBottom: '5px', marginBottom: '20px' }}>
              <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="vip"
                name="radio-buttons-group"
                value={value}
                onChange={handleChange}
              >
                <FormControlLabel value="vip" control={<Radio />} label={t('vipUsersHeading')} />
                <FormControlLabel value="pocket" control={<Radio />} label={t('pocketUsersHeading')} />
              </RadioGroup>
            </FormControl>

            <Box>
              {value === 'vip' && (
                <Box>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', flexWrap: 'wrap', gap: '8px' }}>
                    <TextField
                      id="email-standard-basic"
                      label={t('email')}
                      variant="standard"
                      sx={{ minWidth: '280px' }}
                      autoComplete="off"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                      <Button
                        variant="outlined"
                        startIcon={<PersonSearchIcon />}
                        disabled={isSearching}
                        onClick={handleSearch}
                      >
                        {t('search')}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              )}
              {value === 'pocket' && (
                <Box>
                  <Typography sx={{ marginBottom: '5px' }}>{t('selectPocketRecord')}</Typography>
                  <Autocomplete
                    id="tags-standard"
                    value={selectedPocket}
                    onChange={(e, value) => setSelectedPocket(value)}
                    options={filteredPersons}
                    getOptionLabel={(option) => option.person_name}
                    renderInput={(params) => <TextField {...params} variant="standard" label={t('record')} />}
                    noOptionsText={t('noMatchRecord')}
                  />
                </Box>
              )}
              {isSearching && (
                <CircularProgress
                  color="secondary"
                  size={40}
                  disableShrink={true}
                  sx={{
                    display: 'flex',
                    margin: '40px auto',
                  }}
                />
              )}
              {notFound && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                  <DoNotTouchIcon color="error" sx={{ fontSize: '50px' }} />
                  <Typography>{t('accountNotFound')}</Typography>
                </Box>
              )}
              {isMember && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                  <InfoIcon color="primary" sx={{ fontSize: '50px' }} />
                  <Typography>{t('accountExist')}</Typography>
                </Box>
              )}
              {found && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
                  <ThumbUpIcon color="success" sx={{ fontSize: '50px' }} />
                  <Typography>{t('cpeUserFound')}</Typography>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          {(selectedPocket || found) && (
            <Button onClick={handleCreateCongPerson} color="primary">
              {t('create')}
            </Button>
          )}
          <Button onClick={handleClose} color="primary">
            {t('cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CongregationPersonAdd;
