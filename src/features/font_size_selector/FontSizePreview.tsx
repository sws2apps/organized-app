import { Box } from '@mui/material';
import Typography from '@components/typography';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { FontSizePreviewPropsType } from './index.types';

const FontSizePreview = ({ scale, activeScale }: FontSizePreviewPropsType) => {
  const { t } = useAppTranslation();
  const { laptopUp } = useBreakpoints();

  // each option shows a size the app is not currently using: 1rem is the root
  // size of the active option, so dividing by its scale keeps the sample tied
  // to the browser font size the same way the app itself is. `&&` keeps these
  // sizes ahead of the typography class they reuse
  const size = (base: number) => `${(base / 16) * (scale / activeScale)}rem`;

  const titleSize = size(laptopUp ? 18 : 16);
  const bodySize = size(15);
  const captionSize = size(12);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <Typography
        className="h3"
        sx={{ '&&': { fontSize: titleSize, lineHeight: 1.3 } }}
      >
        {t('tr_fontSizePreviewTitle')}
      </Typography>

      <Typography
        className="body-regular"
        color="var(--grey-400)"
        sx={{ '&&': { fontSize: bodySize, lineHeight: 1.35 } }}
      >
        {t('tr_fontSizePreviewText')}
      </Typography>

      <Typography
        className="label-small-regular"
        color="var(--grey-350)"
        sx={{ '&&': { fontSize: captionSize, lineHeight: 1.35 } }}
      >
        {t('tr_fontSizePreviewCaption')}
      </Typography>
    </Box>
  );
};

export default FontSizePreview;
