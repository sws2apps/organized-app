import { Box } from '@mui/material';
import { StyledModalWindowConatiner } from '../modal_window.styled';
import { QuickSettingsModalWindowProps } from './quick_settings.types';
import CustomTypography from '@components/typography';
import useAppTranslation from '@hooks/useAppTranslation';
import CustomSwitch from '@components/switch';
import CustomButton from '@components/button';

const QuickSettingsModalWindow = (props: QuickSettingsModalWindowProps) => {
  const { t } = useAppTranslation();

  return (
    <StyledModalWindowConatiner>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <CustomTypography className="h2">
          {t('tr_quickSettingsFieldServiceGroups')}
        </CustomTypography>
        <CustomTypography className="body-regular" color={'var(--grey-400)'}>
          {t('tr_quickSettingsFieldServiceGroupsDesc')}
        </CustomTypography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        <CustomSwitch
          checked={props.showTimeAwayToAllUsers}
          onChange={props.onChange}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
          }}
        >
          <CustomTypography className="body-regular">
            {t('tr_showTimeAwayToAllUsers')}
          </CustomTypography>
          <CustomTypography
            className="label-small-regular"
            color={'var(--grey-350)'}
          >
            {t('tr_allowAllUsersToViewTheTimeDesc')}
          </CustomTypography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <CustomButton
          variant="main"
          onClick={() => {
            // onClick
          }}
        >
          {t('tr_done')}
        </CustomButton>
        <CustomButton
          variant="secondary"
          onClick={() => {
            // onClick
          }}
        >
          {t('tr_cancel')}
        </CustomButton>
      </Box>
    </StyledModalWindowConatiner>
  );
};

export default QuickSettingsModalWindow;
