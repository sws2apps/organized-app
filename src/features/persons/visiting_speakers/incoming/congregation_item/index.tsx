import { Box, Collapse } from '@mui/material';
import { IncomingCongregationType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useList from './useList';
import CongregationInfoEdit from '../congregation_info/edit';
import CongregationInfoView from '../congregation_info/view';
import IncomingCongregationHeader from '../header';
import SpeakersList from '../speakers_list';
import Tabs from '@components/tabs';

const IncomingCongregation = ({
  congregation,
  currentExpanded,
  onChangeCurrentExpanded,
}: IncomingCongregationType) => {
  const { t } = useAppTranslation();

  const {
    handleToggleEdit,
    isEditMode,
    isExpanded,
    handleToggleExpanded,
    handleDeleteCongregation,
  } = useList({
    currentExpanded,
    id: congregation.id,
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
        cong_name={congregation.cong_data.cong_name.value}
        cong_number={congregation.cong_data.cong_number.value}
        cong_synced={congregation.cong_data.cong_id.length > 0}
        editMode={isEditMode}
        expanded={isExpanded}
        onEditModeChange={handleToggleEdit}
        onExpandChange={handleToggleExpanded}
        onDelete={handleDeleteCongregation}
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
                    <SpeakersList
                      isEditMode={isEditMode}
                      cong_id={congregation.id}
                      cong_synced={congregation.cong_data.cong_id.length > 0}
                    />
                  ),
                },
                {
                  label: t('tr_congregationInfo'),
                  Component: isEditMode ? (
                    <CongregationInfoEdit
                      cong_number={congregation.cong_data.cong_number.value}
                    />
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
