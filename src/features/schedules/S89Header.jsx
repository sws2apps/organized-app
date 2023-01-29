import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';
import { Markup } from 'interweave';
import Typography from '@mui/material/Typography';
import { sourceLangState } from '../../states/main';

const S89Header = () => {
  const { t } = useTranslation('source');

  const sourceLang = useRecoilValue(sourceLangState);

  return (
    <Typography
      align="center"
      sx={{
        paddingTop: '10px',
        fontFamily: 'Segoe UI',
        fontWeight: 'bold',
        fontSize: '15px',
        lineHeight: 1.3,
        color: 'black',
      }}
    >
      <Markup content={t('s89Title', { lng: sourceLang })} />
    </Typography>
  );
};

export default S89Header;
