import { useAppTranslation } from '@hooks/index';
import { AppStartInfoButtonProps } from './index.types';
import { useState } from 'react';
import Button from '@components/button';
import { IconClose, IconHelp } from '@components/icons';
import { Box, Popper } from '@mui/material';
import Typography from '@components/typography';

const AppStartInfoButton = ({
  variant = 'findYourCongregation',
}: AppStartInfoButtonProps) => {
  const { t } = useAppTranslation();

  const [bannerIsShow, setBannerIsShow] = useState(false);
  const [bannerAnchorElement, setBannerAnchorElement] = useState(null);

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
      <Popper
        open={bannerIsShow}
        placement="top-start"
        anchorEl={bannerAnchorElement}
      >
        <Box
          sx={{
            borderRadius: '12px',
            maxWidth: '800px',
            border: '1px solid var(--accent-300)',
            gap: '8px',
            padding: '16px',
            backgroundColor: 'var(--accent-100)',
            marginBottom: '16px',
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Typography
            className="h4"
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
      </Popper>
      <Button
        variant="small"
        startIcon={<IconHelp />}
        onClick={(event) => {
          setBannerAnchorElement(event.currentTarget);
          setBannerIsShow((prev) => !prev);
        }}
      >
        {buttonLabel}
      </Button>
    </>
  );
};

export default AppStartInfoButton;
