import { Box, Stack } from '@mui/material';
import { IconInfo } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { FormHeaderProps } from './index.types';
import useFormHeader from './useFormHeader';
import Markup from '@components/text_markup';

const FormHeader = (props: FormHeaderProps) => {
  const { t } = useAppTranslation();

  const { pending, approved } = useFormHeader(props);

  if (!pending && !approved) return <></>;

  return (
    <Stack spacing="16px">
      {approved && (
        <Box
          sx={{
            borderRadius: '12px',
            padding: '16px',
            backgroundColor: 'var(--green-secondary)',
            border: '1px solid var(--green-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <IconInfo color="var(--green-main)" />
          <Markup
            className="body-regular"
            color="var(--green-main)"
            content={t('tr_monthsApprovedAP')}
          />
        </Box>
      )}

      {pending && (
        <Box
          sx={{
            borderRadius: '12px',
            padding: '16px',
            backgroundColor: 'var(--orange-secondary)',
            border: '1px solid var(--orange-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <IconInfo color="var(--orange-dark)" />
          <Markup
            className="body-regular"
            color="var(--orange-dark)"
            content={t('tr_monthsPendingAP', { months: pending })}
          />
        </Box>
      )}
    </Stack>
  );
};

export default FormHeader;
