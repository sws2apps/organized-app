import { useTranslation } from 'react-i18next';
import React from 'react';
import IconLoading from '../icons/IconLoading';
import {StyledCircleBox} from './loading.styles';
import { Typography } from '@components';

export const Loading = () => {
  const { t } = useTranslation();

  return (
    <StyledCircleBox>
      <IconLoading color='var(--accent-main)' width={72} height={72}/>
        <Typography className='h4' color='var(--accent-main)'>
          {t('Loading...')}
        </Typography>
    </StyledCircleBox>
  );
};

export default Loading;
