import { Box } from '@mui/material';
import useAppTranslation from '@hooks/useAppTranslation';
import CustomButton from '@components/button';
import CustomTypography from '@components/typography';
import { RemovePublisherModalWindowProps } from './remove_publisher.types';

const RemovePublisherModalWindow = (props: RemovePublisherModalWindowProps) => {
  const { t } = useAppTranslation();

  return (
    <Box
      sx={{
        padding: '24px',
        gap: '24px',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '500px',
        backgroundColor: 'var(--white)',
        borderRadius: 'var(--radius-xl)',
      }}
      className="pop-up-shadow"
    >
      <Box
        sx={{
          gap: '16px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CustomTypography className="h2">
          {t('tr_removePublisher', { PersonName: props.userName })}
        </CustomTypography>

        <CustomTypography className="body-regular" color={'var(--grey-400)'}>
          {t('tr_confirmRemoving', {
            GroupNumber: props.groupId,
            GroupName: props.groupName,
          })}
        </CustomTypography>
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
          color={'red'}
          onClick={props.onRemoveButtonClick}
        >
          {t('tr_delete')}
        </CustomButton>
        <CustomButton variant="secondary" onClick={props.onCancelButtonClick}>
          {t('tr_cancel')}
        </CustomButton>
      </Box>
    </Box>
  );
};

export default RemovePublisherModalWindow;
