import { Box, Skeleton } from '@mui/material';
import MinistryCardSkeletonLoader from './components/ministry_skeleton_loader';
import MeetingCardSkeletonLoader from './components/meeting_skeleton_loader';
import PersonsCardSkeletonLoader from './components/persons_skeleton_loader';
import MeetingMaterialsCardSkeletonLoader from './components/meetings_materials_skeleton_loader';
import ReportCardSkeletonLoader from './components/reports_skeleton_loader';
import CongregationCardSkeletonLoader from './components/congregation_skeleton_loader';

const DashboardSkeletonLoader = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          maxWidth: '392px',
          height: '52px',
        }}
      >
        <Skeleton
          variant="rectangular"
          sx={{
            background: 'var(--accent-200)',
            borderRadius: '30px',
            width: '160px',
            height: '20px',
          }}
        />
        <Skeleton
          variant="rectangular"
          sx={{
            background: 'var(--accent-200)',
            borderRadius: '22.5px',
            height: '16px',
          }}
        />
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gridGap: '24px',
        }}
      >
        <MinistryCardSkeletonLoader />
        <MeetingCardSkeletonLoader />
        <PersonsCardSkeletonLoader />
        <MeetingMaterialsCardSkeletonLoader />
        <ReportCardSkeletonLoader />
        <CongregationCardSkeletonLoader />
      </Box>
    </Box>
  );
};

export default DashboardSkeletonLoader;
