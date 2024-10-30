import { Box } from '@mui/material';
import { IconInfo } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import Markup from '@components/text_markup';

const FormFooter = () => {
  const { t } = useAppTranslation();

  return (
    <Box
      sx={{
        borderRadius: 'var(--radius-xl)',
        padding: '16px',
        backgroundColor: 'var(--white)',
        border: '1px solid var(--accent-300)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      <IconInfo color="var(--accent-400)" />
      <Markup
        content={t('tr_moreInformationForAP')}
        className="body-regular"
        color="var(--grey-400)"
        anchorClassName="h4"
      />
    </Box>
  );
};

export default FormFooter;
