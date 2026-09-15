import { Stack } from '@mui/material';
import Typography from '@components/typography';
import TextField from '@components/textfield';
import IconButton from '@components/icon_button';
import { IconDelete } from '@components/icons';
import Divider from '@components/divider';
import { EditExternalLinkButtonProps } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useEditExternalLinkButton from './useEditExternalLinkButton';

const EditExternalLinkButton = (props: EditExternalLinkButtonProps) => {
  const { t } = useAppTranslation();

  const { labelError, linkError } = useEditExternalLinkButton(props);

  return (
    <Stack spacing="16px">
      <Typography className="body-small-semibold" color="var(--grey-350)">
        {t('tr_customButton', { num: props.index })}
      </Typography>

      <Stack direction="row" spacing="8px">
        <TextField
          label={t('tr_buttonLabel')}
          value={props.label}
          onChange={(e) => props.onChange(props.id, { label: e.target.value })}
          error={labelError !== ''}
          helperText={labelError !== '' && t(labelError)}
          slotProps={{
            htmlInput: {
              maxLength: 25,
            },
          }}
        />

        <TextField
          label={t('tr_link')}
          type="url"
          value={props.link}
          onChange={(e) => props.onChange(props.id, { link: e.target.value })}
          error={linkError !== ''}
          helperText={linkError !== '' && t(linkError)}
        />

        <Stack direction="row" alignItems="center" sx={{ pl: '12px' }}>
          <IconButton
            color="error"
            aria-label={t('tr_deleteCustomButton', { num: props.index })}
            onClick={() => props.onDelete(props.id)}
          >
            <IconDelete color="var(--red-main)" />
          </IconButton>
        </Stack>
      </Stack>

      {props.showDivider && <Divider color="var(--accent-200)" />}
    </Stack>
  );
};

export default EditExternalLinkButton;
