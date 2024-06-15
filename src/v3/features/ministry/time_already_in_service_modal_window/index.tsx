import CustomButton from '@components/button';
import CPETimePickerSlider from '@components/time_picker_slider';
import CustomTypography from '@components/typography';
import useAppTranslation from '@hooks/useAppTranslation';
import { Box } from '@mui/material';
import { TimeAlreadyInServiceModalWindowProps } from './time_already_in_service_modal_window.types';
import { useState } from 'react';

/**
 * Represents a modal window used to handle situations where the user attempts to add a time entry
 * that conflicts with an existing entry.
 *
 * @param {TimeAlreadyInServiceModalWindowProps} props - Props for configuring the modal window.
 * @returns {JSX.Element} The JSX element representing the modal window.
 */
const TimeAlreadyInServiceModalWindow = (props: TimeAlreadyInServiceModalWindowProps) => {
  const { t } = useAppTranslation();

  const [localTimeInSeconds, setLocalTimeInSeconds] = useState(0);

  return (
    <Box
      className="pop-up-shadow"
      sx={(theme) => ({
        maxWidth: '500px',
        border: '1px solid var(--accent-200)',
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        display: 'flex',
        gap: '16px',
        flexDirection: 'column',

        marginLeft: { mobile: '16px', tablet: '24px', desktop: '32px' },
        marginRight: { mobile: '16px', tablet: '24px', desktop: '32px' },
        marginTop: '16px',
        marginBottom: '16px',

        [theme.breakpoints.up(540)]: {
          width: '100%',
        },
      })}
    >
      <CustomTypography color={'var(--black)'} className="h2">
        {t('tr_timeInService')}
      </CustomTypography>
      <CustomTypography color={'var(--grey-400)'} className="body-regular">
        {t('tr_timeInServiceDesc')}
      </CustomTypography>
      <Box
        sx={{
          width: '100%',
          border: '1px solid var(--accent-300)',
          borderRadius: 'var(--radius-l)',
          padding: '16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CPETimePickerSlider
          ampm={false}
          onChange={(value) => {
            setLocalTimeInSeconds(value);
          }}
        />
      </Box>
      <Box
        sx={(theme) => ({
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          [theme.breakpoints.down('tablet')]: {
            flexDirection: 'column',
            gap: '8px',
          },
        })}
      >
        <CustomButton variant="secondary" onClick={() => props.cancelButtonClick()}>
          {t('tr_cancel')}
        </CustomButton>
        <CustomButton variant="main" onClick={() => props.addButtonClick(localTimeInSeconds)}>
          {t('tr_add')}
        </CustomButton>
      </Box>
    </Box>
  );
};

export default TimeAlreadyInServiceModalWindow;
