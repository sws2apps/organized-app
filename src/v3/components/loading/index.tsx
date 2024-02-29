import { useAppTranslation } from '@hooks/index';
import React from 'react';
import IconLoading from '../icons/IconLoading';
import { StyledCircleBox } from './loading.styles';
import Typography from '@components/typography';

export const Loading = () => {
  const { t } = useAppTranslation();

  return (
    <StyledCircleBox className="pop-up-shadow">
      <IconLoading color="var(--accent-main)" width={72} height={72} />
      <Typography className="h4" color="var(--accent-main)">
        {t('tr_loading')}
      </Typography>
    </StyledCircleBox>
  );
};

export default Loading;
