import React, { useState } from 'react';
import { Trans } from 'react-i18next';
import { Box, Link, Stack } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { ButtonSubmitApplication } from '@features/index';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { InfoTip, PageTitle, Typography } from '@components/index';
import MemberAccountItem from '@components/member_account_item';
import { IconInfo } from '@components/icons';
import APSForm from './aps_form';
import APSSnackbar from './aps_snackbar';

const AuxiliaryPioneer = () => {
  const { t } = useAppTranslation();
  const { laptopUp } = useBreakpoints();
  const [continuousServiceDesire, setContinuousServiceDesire] = useState(false);

  return (
    <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
      <PageTitle
        title={t('tr_applicationAuxiliaryPioneer')}
        buttons={laptopUp ? <ButtonSubmitApplication /> : null}
      />
      <Box
        sx={{
          flexGrow: 1,
          backgroundColor: 'var(--white)',
          border: '1px solid var(--accent-300)',
          padding: '16px',
          borderRadius: 'var(--radius-xl)',
          gap: '16px',
        }}
      >
        <Grid container spacing={2}>
          <APSForm
            continuousServiceDesire={continuousServiceDesire}
            setContinuousServiceDesire={setContinuousServiceDesire}
          />
          <Grid mobile={12} laptop={6} paddingRight={4}>
            <Typography className="h4" color="var(--black)" marginTop={2}>
              {t('tr_noteAPSApplication')}
            </Typography>
            <Typography
              className="h4"
              marginTop={2}
              marginBottom={1}
              component="div"
            >
              <Stack direction="column" gap={1}>
                <Trans i18nKey="tr_attentionServiceCommittee" />
              </Stack>
            </Typography>
          </Grid>
          <Grid mobile={12} laptop={6}>
            <Typography className="h4" align="center" marginY={2}>
              {t('tr_approvingAPSApplication')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { name: 'Mike Wandelt', role: 'Coordinator' },
                { name: 'David Offenbarung', role: 'Service overseer' },
                { name: 'John Netherleed', role: 'Secretary' },
              ].map((member) => (
                <MemberAccountItem
                  key={member.name}
                  name={member.name}
                  role={member.role}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Box>

      <InfoTip icon={<IconInfo />} color="white" isBig={false}>
        <Trans i18nKey="tr_moreInformationForAP">
          <Link
            href="https://hub.jw.org"
            className="h4"
            color="var(--accent-dark)"
            underline="none"
            target="_blank"
          >
            link
          </Link>
        </Trans>
      </InfoTip>

      {!laptopUp && (
        <Box
          sx={{ display: 'flex', flexDirection: 'column-reverse', gap: '8px' }}
        >
          <ButtonSubmitApplication />
        </Box>
      )}

      {continuousServiceDesire && <APSSnackbar />}
    </Box>
  );
};

export default AuxiliaryPioneer;
