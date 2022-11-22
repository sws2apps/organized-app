import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Fab from '@mui/material/Fab';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { VipUser } from './';
import { apiHostState, userEmailState, visitorIDState } from '../../states/main';
import { appMessageState, appSeverityState, appSnackOpenState } from '../../states/notification';
import { congIDState } from '../../states/congregation';

const VipUsers = () => {
  const cancel = useRef();

  const navigate = useNavigate();

  const setAppSnackOpen = useSetRecoilState(appSnackOpenState);
  const setAppSeverity = useSetRecoilState(appSeverityState);
  const setAppMessage = useSetRecoilState(appMessageState);

  const userEmail = useRecoilValue(userEmailState);
  const apiHost = useRecoilValue(apiHostState);
  const visitorID = useRecoilValue(visitorIDState);
  const congID = useRecoilValue(congIDState);

  const [isProcessing, setIsProcessing] = useState(true);
  const [members, setMembers] = useState([]);

  const handleAddMember = () => {
    navigate('/administration/members/new');
  };

  const getCongregationMembers = useCallback(async () => {
    try {
      if (apiHost !== '') {
        cancel.current = false;

        setIsProcessing(true);
        const res = await fetch(`${apiHost}api/congregations/${congID}/members`, {
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
            setMembers(data);
            setIsProcessing(false);
            return;
          }

          setIsProcessing(false);
          setAppMessage(data.message);
          setAppSeverity('warning');
          setAppSnackOpen(true);
        }
      }
    } catch (err) {
      if (!cancel.current) {
        setIsProcessing(false);
        setAppMessage(err.message);
        setAppSeverity('error');
        setAppSnackOpen(true);
      }
    }
  }, [apiHost, cancel, congID, setAppMessage, setAppSeverity, setAppSnackOpen, userEmail, visitorID]);

  useEffect(() => {
    getCongregationMembers();
  }, [getCongregationMembers]);

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
          marginBottom: '40px',
        }}
      >
        {isProcessing && (
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
        {!isProcessing &&
          members.length > 0 &&
          members.map((member) => (
            <VipUser key={member.id} member={member} setMembers={(value) => setMembers(value)} />
          ))}
      </Box>

      <Box sx={{ '& > :not(style)': { m: 1 }, position: 'fixed', bottom: 20, right: 20 }}>
        <Fab aria-label="save" color="primary" onClick={handleAddMember}>
          <PersonAddIcon />
        </Fab>
      </Box>
    </Box>
  );
};

export default VipUsers;
