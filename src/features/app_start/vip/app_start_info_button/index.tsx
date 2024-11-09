import { useAppTranslation } from '@hooks/index';
import { AppStartInfoButtonProps } from './index.types';
import { useState } from 'react';
import Button from '@components/button';
import { IconClose, IconHelp } from '@components/icons';
import { Box } from '@mui/material';
import Typography from '@components/typography';

const AppStartInfoButton = ({
  variant = 'findYourCongregation',
}: AppStartInfoButtonProps) => {
  const { t } = useAppTranslation();

  const [bannerIsShow, setBannerIsShow] = useState(false);

  let buttonLabel: string;
  let bannerMessage: string;

  switch (variant) {
    case 'findYourCongregation':
      buttonLabel = t("tr_can'tFindCongregation");
      bannerMessage = t('tr_cantFindCongregationDesc');
      break;

    case 'codesDifferent':
      buttonLabel = t('tr_howAreTheCodesDifferent');
      bannerMessage = t('tr_howAreTheCodesDifferentDesc');
      break;
  }

  return (
    <>
      <Box
        sx={{
          visibility: bannerIsShow ? 'visible' : 'hidden',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '800px',
          border: '1px solid var(--accent-300)',
          gap: '8px',
          padding: '16px',
          backgroundColor: 'var(--accent-100)',
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <Typography
          className="h4"
          color="var(--accent-400)"
          dangerouslySetInnerHTML={{ __html: bannerMessage }}
        />
        <Box
          onClick={() => setBannerIsShow(false)}
          sx={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',

            '&:hover': {
              backgroundColor: 'var(--grey-200)',
            },
          }}
        >
          <IconClose color="var(--accent-400)" />
        </Box>
      </Box>
      <Button
        variant="small"
        sx={{
          maxWidth: '243px',
        }}
        startIcon={<IconHelp />}
        onClick={() => setBannerIsShow((prev) => !prev)}
      >
        {buttonLabel}
      </Button>
    </>
  );
};

export default AppStartInfoButton;
