import { useCallback, useEffect, useRef, useState } from 'react';
import { getAuth } from '@firebase/auth';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { apiHostState, isCongPersonAddState, visitorIDState } from '../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { congIDState } from '../../states/congregation';
import CongregationPersonsGroup from './CongregationPersonsGroup';

const CongregationPersons = () => {
  const { t } = useTranslation('ui');

  const cancel = useRef();

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);
  const setIsCongPersonAdd = useSetRecoilState(isCongPersonAddState);

  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);
  const congID = useRecoilValue(congIDState);

  const [isProcessing, setIsProcessing] = useState(true);
  const [members, setMembers] = useState([]);

  const handleAddMember = () => {
    setIsCongPersonAdd(true);
  };

  const handleFetchUsers = useCallback(async () => {
    if (apiHost !== '') {
      cancel.current = false;

      const auth = await getAuth();
      const user = auth.currentUser;

      const res = await fetch(`${apiHost}api/congregations/${congID}/members`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          visitorid: visitorID,
          uid: user.uid,
        },
      });

      return await res.json();
    }
  }, [apiHost, congID, visitorID]);

  const { isLoading, error, data } = useQuery({ queryKey: ['congPersons'], queryFn: handleFetchUsers });

  useEffect(() => {
    if (data) {
      const tempData1 = data.reduce((group, person) => {
        const { global_role } = person;
        group[global_role] = group[global_role] ?? [];
        group[global_role].push(person);
        return group;
      }, {});

      const tempData2 = [];
      Object.keys(tempData1).forEach(function (key, index) {
        const obj = {
          global_role: key,
          persons: tempData1[key],
          label: key === 'vip' ? t('vipUsersHeading') : t('pocketUsersHeading'),
        };

        tempData2.push(obj);
      });

      tempData2.sort((a, b) => {
        return a.label > b.label ? 1 : -1;
      });

      setMembers(tempData2);
    }
  }, [data, t]);

  useEffect(() => {
    setIsProcessing(isLoading);
  }, [isLoading]);

  useEffect(() => {
    if (error) {
      setAppMessage(error);
      setAppSeverity('error');
      setAppSnackOpen(true);
    }
  }, [error, setAppMessage, setAppSeverity, setAppSnackOpen]);

  useEffect(() => {
    return () => {
      cancel.current = true;
    };
  }, [cancel]);

  return (
    <Box>
      <Box
        sx={{
          padding: '10px',
          marginTop: '20px',
          marginBottom: '60px',
        }}
      >
        {isProcessing && (
          <CircularProgress
            color="secondary"
            size={40}
            disableShrink={true}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              margin: 'auto',
            }}
          />
        )}
        {!isProcessing &&
          members.length > 0 &&
          members.map((group) => <CongregationPersonsGroup key={group.global_role} congregationGroup={group} />)}
      </Box>

      <Box sx={{ '& > :not(style)': { m: 1 }, position: 'fixed', bottom: 20, right: 20 }}>
        <Fab aria-label="save" color="primary" onClick={handleAddMember}>
          <PersonAddIcon />
        </Fab>
      </Box>
    </Box>
  );
};

export default CongregationPersons;
