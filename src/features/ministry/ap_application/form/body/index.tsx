import { Box, Stack } from '@mui/material';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import useFormBody from './useFormBody';
import Card from '@components/card';
import Typography from '@components/typography';
import Markup from '@components/text_markup';
import CommitteeMember from '../sc_member';

const FormBody = () => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const { moral_text } = useFormBody();

  return (
    <Card>
      <Typography className="h2">{t('tr_applicationAPS')}</Typography>
      <Typography>{t('tr_applicationAPSDesc')}</Typography>

      <Markup
        content={moral_text}
        className="body-regular"
        anchorClassName="h4"
      />

      <Box
        sx={{
          display: 'flex',
          gap: laptopUp ? '80px' : '24px',
          flexDirection: laptopUp ? 'row' : 'column',
        }}
      >
        <Stack spacing="16px" flex={1}>
          <Typography className="h4">{t('tr_noteAPSApplication')}</Typography>
          <Markup content={t('tr_attentionServiceCommittee')} className="h4" />
        </Stack>

        <Stack spacing="16px" flex={1}>
          <Typography className="h4" textAlign="center">
            {t('tr_approvingAPSApplication')}
          </Typography>

          <Stack spacing="8px">
            <CommitteeMember name="" role={t('tr_coordinator')} />
            <CommitteeMember name="" role={t('tr_serviceOverseer')} />
            <CommitteeMember name="Mike Wandelt" role={t('tr_secretary')} />
          </Stack>
        </Stack>
      </Box>
    </Card>
  );
};

export default FormBody;
