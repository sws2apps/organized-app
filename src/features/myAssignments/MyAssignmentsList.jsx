import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { appLangState, monthNamesState, refreshMyAssignmentsState, userLocalUidState } from '../../states/main';
import { dbStudentAssignmentsHistory } from '../../indexedDb/dbAssignment';
import MyAssignmentsMonth from './MyAssignmentsMonth';

const MyAssignmentsList = () => {
  const localUid = useRecoilValue(userLocalUidState);
  const monthNames = useRecoilValue(monthNamesState);
  const appLang = useRecoilValue(appLangState);
  const refresh = useRecoilValue(refreshMyAssignmentsState);

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    const getMyAssignments = async () => {
      setIsLoading(true);
      const tempAssignments = await dbStudentAssignmentsHistory(localUid);

      const d = new Date();
      const todayDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayValue = todayDate.getDay();
      const diff = todayDate.getDate() - dayValue + (dayValue === 0 ? -6 : 1);
      const currentWeekDate = new Date(todayDate.setDate(diff));

      const msInDay = 24 * 60 * 60 * 1000;

      const tempData = [];
      for (let a = tempAssignments.length - 1; a >= 0; a--) {
        const item = tempAssignments[a];
        const weekDate = new Date(item.weekOf);
        const dayDiff = Math.round((weekDate - currentWeekDate) / msInDay);

        if (dayDiff >= 0) {
          tempData.push(item);
        }
      }

      const tempData2 = tempData.map((assignment) => {
        const split = assignment.weekOf.split('/');
        const monthIndex = +split[0] - 1;
        const monthValue = `${monthNames[monthIndex]} ${split[2]}`;
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
    };

    getMyAssignments();
  }, [appLang, localUid, monthNames, refresh]);

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
