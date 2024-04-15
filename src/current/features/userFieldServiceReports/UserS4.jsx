import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import UserS4Field from './UserS4Field';
import { UserS4MonthlyReport } from '../../classes/UserS4MonthlyReport';
import { refreshReportState } from '../../states/report';
import { UserS4Records } from '../../classes/UserS4Records';

const UserS4 = ({ isOpen, isSubmitted, month }) => {
  const { t } = useTranslation('ui');

  const refreshScreen = useRecoilValue(refreshReportState);

  const [isLoading, setIsLoading] = useState(true);
  const [placements, setPlacements] = useState('');
  const [videos, setVideos] = useState('');
  const [hours, setHours] = useState('');
  const [returnVisits, setReturnVisits] = useState('');
  const [bibleStudies, setBibleStudies] = useState('');
  const [comments, setComments] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const generateS4 = async () => {
      const currentS21 = UserS4Records.getS21(month);
      let data = {};

      if (currentS21) {
        setIsLocked(true);
        data = { ...currentS21, hours: currentS21.duration };
      }

      if (!currentS21) {
        const currentS4 = await UserS4MonthlyReport.get(month);
        if (!currentS4.isSubmitted || currentS4.isPending) {
          await currentS4.generate();
        }

        data = { ...currentS4 };
      }

      setPlacements(data.placements);
      setVideos(data.videos);
      setHours(data.hours);
      setReturnVisits(data.returnVisits);
      setBibleStudies(data.bibleStudies);
      setComments(data.comments);

      setIsLoading(false);
    };

    if (isOpen) {
      generateS4();
    }
  }, [isOpen, month, refreshScreen]);

  useEffect(() => {
    setHasError(false);

    if (bibleStudies !== '' && returnVisits === '') {
      setHasError(true);
      return;
    }

    if (bibleStudies !== '' && returnVisits !== '') {
      if (returnVisits < bibleStudies) {
        setHasError(true);
      }
    }
  }, [returnVisits, bibleStudies]);

  return (
    <Collapse
      in={isOpen}
      timeout="auto"
      unmountOnExit
      sx={{
        marginTop: '20px',
        borderBottom: isSubmitted || isLocked ? 'none' : '2px outset',
        paddingBottom: isSubmitted || isLocked ? 'none' : '20px',
      }}
    >
      {isLoading && (
        <Box sx={{ width: '350px' }}>
          <CircularProgress
            color="secondary"
            size={60}
            disableShrink={true}
            sx={{
              display: 'flex',
              margin: '10px auto',
            }}
          />
        </Box>
      )}
      {!isLoading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <UserS4Field field="placements" value={placements} />
          <UserS4Field field="videos" value={videos} />
          <UserS4Field field="hours" value={hours} isLocked={isLocked} />
          <UserS4Field field="returnVisits" errorField={hasError} value={returnVisits} />
          <UserS4Field field="bibleStudies" errorField={hasError} value={bibleStudies} />
          {hasError && (
            <Typography color="error" sx={{ fontSize: '14px' }}>
              {t('lessReturnVisitsErrorPublisher')}
            </Typography>
          )}
          <UserS4Field
            month={month}
            field="comments"
            isSubmitted={isSubmitted}
            isLocked={isLocked}
            value={comments}
            setValue={(value) => setComments(value)}
          />
        </Box>
      )}
    </Collapse>
  );
};

export default UserS4;
