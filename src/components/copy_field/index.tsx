import { IconCopy } from '@components/icons';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import { Box, Stack } from '@mui/material';
import { displaySnackNotification } from '@services/states/app';
import { copyToClipboard } from '@utils/common';
import { ReactNode, useCallback } from 'react';

export type CopyFieldProps = {
  label: string;
  value: string;
  icon: ReactNode;
};

const CopyField = (props: CopyFieldProps) => {
  const { t } = useAppTranslation();
  const handleCopy = useCallback(() => {
    copyToClipboard(props.value);

    displaySnackNotification({
      header: t('tr_textCopied'),
      message: props.value,
      severity: 'success',
    });
  }, [props.value, t]);

  return (
    <Box
      role="button"
      onClick={handleCopy}
      sx={{
        backgroundColor: 'var(--accent-100)',
        padding: '8px 12px',
        gap: '16px',
        borderRadius: 'var(--radius-s)',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        cursor: 'pointer',

        '&:hover': {
          '.organized-icon-copy path': {
            fill: 'var(--accent-350)',
          },
        },

        '&:focus-visible': {
          outline: 'var(--accent-main) auto 1px',
        },
      }}
    >
      <Stack spacing={'8px'} direction={'row'} alignItems={'center'}>
        {props.icon}
        <Typography className="body-regular">{`${props.label}:`}</Typography>
        <Typography className="h4">{props.value}</Typography>
      </Stack>
      <IconCopy color="var(--accent-100)" />
    </Box>
  );
};

export default CopyField;
