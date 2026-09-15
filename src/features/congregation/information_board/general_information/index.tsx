import { Box } from '@mui/material';
import CongregationInfo from './congregation_info';
import SWMeetingTimes from '../smart_widgets/meeting_times';
import SWAuxiliaryPioneer from '../smart_widgets/auxiliary_pioneers';
import SWMonthsOfSpecialActivity from '../smart_widgets/months_of_special_activity';
import useBreakpoints from '@hooks/useBreakpoints';
import useGeneralInformation from './useGeneralInformation';
import useIBPageAnnouncements from '../useIBPageAnnouncements';

const GeneralInformation = () => {
  const { tablet688Up } = useBreakpoints();
  const { swAuxiliaryPioneer, swMeetingTimes, swMonthsOfSpecialActivity } =
    useGeneralInformation();
  const { pinnedAnnouncements, unpinnedAnnouncements } = useIBPageAnnouncements(
    'general_information'
  );
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
      }}
    >
      <CongregationInfo />
      <Box
        sx={{
          columnCount: tablet688Up ? 2 : 1,
          columnGap: '16px',
        }}
      >
        {pinnedAnnouncements}
        {swAuxiliaryPioneer && <SWAuxiliaryPioneer />}
        {swMeetingTimes && <SWMeetingTimes />}
        {swMonthsOfSpecialActivity && <SWMonthsOfSpecialActivity />}
        {unpinnedAnnouncements}
      </Box>
    </Box>
  );
};

export default GeneralInformation;
