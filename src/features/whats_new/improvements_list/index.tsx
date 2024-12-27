import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { ImprovementsListProps } from './index.types';
import Markup from '@components/text_markup';
import Typography from '@components/typography';

const ImprovementsList = ({ list, showHeader }: ImprovementsListProps) => {
  const { t } = useAppTranslation();

  return (
    <Stack spacing="4px">
      {showHeader && (
        <Typography className="body-small-semibold" color="var(--black)">
          {t('tr_improvements')}
        </Typography>
      )}

      {list.map((improvement) => (
        <Markup
          key={improvement}
          content={'• ' + improvement}
          className="body-small-regular"
          color="var(--grey-400)"
        />
      ))}
    </Stack>
  );
};

export default ImprovementsList;
