import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { FormHeaderProps } from './index.types';
import useFormHeader from './useFormHeader';
import InfoBanner from '@components/info_banner';
import Markup from '@components/text_markup';

const FormHeader = (props: FormHeaderProps) => {
  const { t } = useAppTranslation();

  const { pending, approved } = useFormHeader(props);

  if (!pending && !approved) return <></>;

  return (
    <Stack spacing="16px">
      {approved && (
        <InfoBanner variant="green" bordered>
          <Markup
            className="body-small-regular"
            color="inherit"
            content={t('tr_monthsApprovedAP', { months: approved })}
          />
        </InfoBanner>
      )}

      {pending && (
        <InfoBanner variant="orange" bordered>
          <Markup
            className="body-small-regular"
            color="inherit"
            content={t('tr_monthsPendingAP', { months: pending })}
          />
        </InfoBanner>
      )}
    </Stack>
  );
};

export default FormHeader;
