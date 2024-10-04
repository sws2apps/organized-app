import { Box, Stack } from '@mui/material';
import { IconEdit } from '@components/icons';
import { useAppTranslation } from '@hooks/index';
import { CommitteeMemberProps } from './index.types';
import useSCMember from './useSCMember';
import ActionButtons from './action_buttons';
import ApprovedLabel from './approved_label';
import AwaitingLabel from './awaiting_label';
import RejectedLabel from './rejected_label';
import Typography from '@components/typography';
import { ActionButton } from './index.styles';

const CommitteeMember = (props: CommitteeMemberProps) => {
  const { t } = useAppTranslation();

  const {
    isEdit,
    label,
    allowEdit,
    status,
    allowOverride,
    handleOverride,
    override,
  } = useSCMember(props);

  return (
    <Box sx={{ containerType: 'inline-size' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderRadius: 'var(--radius-l)',
          padding: '8px 8px 8px 16px',
          border: '1px solid var(--accent-300)',
          gap: '8px',
          flexDirection: { '@': isEdit && 'column', '@500': 'row' },
          '&:hover': {
            backgroundColor: isEdit && 'var(--accent-150)',
            border: isEdit && '1px solid var(--accent-main)',
          },
        }}
      >
        <Stack spacing="4px">
          <Typography className="h4">{props.name}</Typography>
          <Typography className="body-small-regular" color="var(--grey-350)">
            {label}
          </Typography>
        </Stack>

        {isEdit && (
          <Box
            sx={{
              width: { '@': '100%', '@500': '320px' },
              display: 'flex',
              alignItems: { '@': 'stretch', '@350': 'center' },
              justifyContent: { '@': isEdit && 'center', '@500': 'flex-end' },
              gap: '8px',
              flexDirection: { '@': 'column', '@350': 'row' },
            }}
          >
            {!override &&
              status !== 'waiting' &&
              allowEdit &&
              allowOverride && (
                <ActionButton
                  variant="secondary"
                  startIcon={<IconEdit />}
                  onClick={handleOverride}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: { '@': 'center', '@500': 'flex-end' },
                    width: { '@': '100%', '@500': 'min-content !important' },
                    flex: { '@': 1, '@500': 'unset' },
                  }}
                >
                  {t('tr_edit')}
                </ActionButton>
              )}

            {!override && status === 'approved' && <ApprovedLabel />}

            {!override && status === 'rejected' && <RejectedLabel />}

            {status === 'waiting' && !allowEdit && <AwaitingLabel />}

            {(override || status === 'waiting') && allowEdit && (
              <ActionButtons
                onApproved={props.onApproved}
                onRejected={props.onRejected}
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default CommitteeMember;
