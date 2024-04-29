import { Box, Collapse } from '@mui/material';
import { IncomingCongregationType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useList from './useList';
import CongregationInfoEdit from '../congregation_info/edit';
import CongregationInfoView from '../congregation_info/view';
import IncomingCongregationHeader from '../header';
import SpeakersList from '../speakers_list';
import Tabs from '@components/tabs';

const IncomingCongregation = ({ congregation, currentExpanded, onChangeCurrentExpanded }: IncomingCongregationType) => {
  const { t } = useAppTranslation();

  const { handleToggleEdit, isEditMode, speakers, isExpanded, handleToggleExpanded } = useList({
    currentExpanded,
    cong_number: congregation.cong_number,
    onChangeCurrentExpanded,
  });

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundColor: 'var(--white)',
        border: '1px solid var(--accent-300)',
        padding: '8px 16px',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
      }}
    >
      <IncomingCongregationHeader
        cong_name={congregation.cong_name.value}
        cong_number={congregation.cong_number}
        cong_synced={congregation.cong_id.length > 0}
        editMode={isEditMode}
        expanded={isExpanded}
        onEditModeChange={handleToggleEdit}
        onExpandChange={handleToggleExpanded}
      />

      <Collapse in={isExpanded} unmountOnExit>
        <Box
          sx={{
            borderTop: '1px solid var(--accent-200)',
            marginTop: '16px',
            paddingTop: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <Box sx={{ marginTop: '-16px', marginBottom: '-16px' }}>
            <Tabs
              tabs={[
                {
                  label: t('tr_speakers'),
                  Component: (
                    <SpeakersList speakers={speakers} isEditMode={isEditMode} cong_number={congregation.cong_number} />
                  ),
                },
                {
                  label: t('tr_congregationInfo'),
                  Component: isEditMode ? (
                    <CongregationInfoEdit cong_number={congregation.cong_number} />
                  ) : (
                    <CongregationInfoView congregation={congregation} />
                  ),
                },
              ]}
            />
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default IncomingCongregation;
