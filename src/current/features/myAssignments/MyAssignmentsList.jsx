import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import MyAssignmentsMonth from './MyAssignmentsMonth';
import { appLangState, monthNamesState, refreshMyAssignmentsState, userLocalUidState } from '../../states/main';
import { userMembersDelegateState } from '../../states/congregation';
import { fetchMyAssignments } from '../../utils/schedule';

const MyAssignmentsList = () => {
  const userLocalUid = useRecoilValue(userLocalUidState);
  const monthNames = useRecoilValue(monthNamesState);
  const appLang = useRecoilValue(appLangState);
  const refresh = useRecoilValue(refreshMyAssignmentsState);
  const userDelegate = useRecoilValue(userMembersDelegateState);

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    setIsLoading(true);
    const tempAssignments = fetchMyAssignments();

    const tempData2 = tempAssignments.map((assignment) => {
      const split = assignment.weekOf.split('/');
      const monthIndex = +split[1] - 1;
      const monthValue = `${monthNames[monthIndex]} ${split[0]}`;
      return { ...assignment, month_value: monthValue };
    });

    const tempData3 = tempData2.reduce((group, assignment) => {
      const { month_value } = assignment;
      group[month_value] = group[month_value] ?? [];
      group[month_value].push(assignment);
      return group;
    }, {});

    const tempData4 = [];
    Object.keys(tempData3).forEach(function (key, index) {
      const obj = {
        month_value: key,
        month_assignments: tempData3[key],
      };

      tempData4.push(obj);
    });

    setData(tempData4);
    setIsLoading(false);
  }, [appLang, userLocalUid, monthNames, refresh, userDelegate]);

  return (
    <Box>
      {isLoading && (
        <CircularProgress
          color="secondary"
          size={80}
          disableShrink={true}
          sx={{
            display: 'flex',
            margin: '10px auto',
          }}
        />
      )}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {!isLoading &&
          data.length > 0 &&
          data.map((monthData) => (
            <MyAssignmentsMonth monthData={monthData} key={`monthData-${monthData.month_value}`} />
          ))}
      </Box>
    </Box>
  );
};

export default MyAssignmentsList;
