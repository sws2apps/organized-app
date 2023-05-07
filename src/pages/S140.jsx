import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import Box from '@mui/material/Box';
import S140Previewer from '../views/S140MainView';
import { rootModalOpenState } from '../states/main';
import { currentScheduleState } from '../states/schedule';
import { Schedules } from '../classes/Schedules';

const S140 = () => {
  let navigate = useNavigate();

  const setRootModalOpen = useSetRecoilState(rootModalOpenState);

  const currentSchedule = useRecoilValue(currentScheduleState);

  const [data, setData] = useState([]);

  useEffect(() => {
    if (currentSchedule === '' || currentSchedule.value?.length === '') {
      navigate('/schedules');
    } else {
      setRootModalOpen(true);

      const data = Schedules.S140Data(currentSchedule.value);

      setData(data);
      setRootModalOpen(false);
    }
  }, [navigate, currentSchedule, setRootModalOpen]);

  return (
    <>
      {data.length > 0 && (
        <Box>
          <S140Previewer data={data} currentSchedule={currentSchedule} />
        </Box>
      )}
    </>
  );
};

export default S140;
