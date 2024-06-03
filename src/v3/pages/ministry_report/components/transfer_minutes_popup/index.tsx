import { Box } from '@mui/material';
import { TransferMinutesPopUpProps } from './transfer_minutes_popup.types';
import CustomTypography from '@components/typography';
import CustomButton from '@components/button';
import useAppTranslation from '@hooks/useAppTranslation';

const TransferMinutesPopUp = (props: TransferMinutesPopUpProps) => {
  const { t } = useAppTranslation();

  return (
    <Box
      sx={{
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-xl)',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
      }}
      className="pop-up-shadow"
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }}
      >
        <CustomTypography className="h2" color={'var(--black)'}>
          {t('tr_extraTime', { ministryTime: props.extraMinutes })}
        </CustomTypography>
        <CustomTypography className="body-regular" color={'var(--grey-400)'}>
          {t('tr_extraTimeDesc')}
        </CustomTypography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <CustomButton variant={'main'} onClick={props.transferButtonClick}>
          {t('tr_btnTransfer')}
        </CustomButton>
        <CustomButton variant={'secondary'} onClick={props.keepButtonClick}>
          {t('tr_btnNoKeepIt')}
        </CustomButton>
      </Box>
    </Box>
  );
};

export default TransferMinutesPopUp;
