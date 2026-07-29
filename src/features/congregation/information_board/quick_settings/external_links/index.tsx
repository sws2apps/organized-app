import Button from '@components/button';
import { IconAdd } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { Stack, Typography } from '@mui/material';
import useInfoBoardQSExternalLinks from './useInfoBoardQSExternalLinks';
import EditExternalLinkButton from './edit_external_link_button';
import { InfoBoardGeneralInformationDraftProps } from '../index.types';

const InfoBoardQSExternalLinks = (
  props: InfoBoardGeneralInformationDraftProps
) => {
  const {
    externalLinks,
    handleAddExternalLink,
    handleDeleteExternalLink,
    handleUpdateExternalLink,
  } = useInfoBoardQSExternalLinks(props);
  const { t } = useAppTranslation();
  return (
    <Stack spacing="16px">
      <Typography className="body-regular" color="var(--grey-400)">
        {t('tr_infoBoardQuickSettingsELDescription')}
      </Typography>
      {externalLinks
        ?.filter((link) => !link._deleted)
        .map((link, index, result) => (
          <EditExternalLinkButton
            key={link.id}
            {...link}
            showDivider={index !== result.length - 1}
            index={index + 1}
            onChange={handleUpdateExternalLink}
            onDelete={handleDeleteExternalLink}
          />
        ))}

      <Button
        variant="small"
        ariaLabel={t('tr_addCustomButton')}
        startIcon={<IconAdd />}
        sx={{ width: 'fit-content' }}
        onClick={handleAddExternalLink}
      >
        {t('tr_addCustomButton')}
      </Button>
    </Stack>
  );
};

export default InfoBoardQSExternalLinks;
