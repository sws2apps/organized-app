import useAppTranslation from '@hooks/useAppTranslation';
import { useState, MouseEvent } from 'react';
import Typography from '@components/typography';
import Tooltip from '@components/tooltip';
import IconLoading from '@components/icon_loading';
import { IconGenerate } from '@components/icons';
import { Box, IconButton } from '@mui/material';
import { WeekBadgeType } from './index.types';
import { schedulesStartAutofill } from '@services/app/autofill';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';

const WeekBadge = (props: WeekBadgeType) => {
  const { t } = useAppTranslation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAutofill = async (e: MouseEvent) => {
    e.stopPropagation();
    if (!props.week) return;

    try {
      setIsProcessing(true);
      await schedulesStartAutofill(props.week, props.week, 'midweek');
    } catch (error) {
      console.error(error);
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode(error.message),
        severity: 'error',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Box
      sx={{
        flex: '1',
        height: '32px',
        padding: '6px 8px 6px 8px',
        gap: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--accent-150)',
        borderRadius: 'var(--radius-s)',
        position: 'relative',
      }}
    >
      <Typography color={'var(--accent-dark)'} className="h4">
        {props.text}
      </Typography>
      {props.week && (
        <Tooltip
          title={t('tr_autofillThisWeek')}
          show={!isProcessing}
          placement="top"
        >
          <IconButton
            onClick={handleAutofill}
            disabled={isProcessing}
            sx={{
              padding: '4px',
              position: 'absolute',
              right: '4px',
            }}
          >
            {isProcessing ? (
              <IconLoading width={16} height={16} color="var(--accent-dark)" />
            ) : (
              <IconGenerate color="var(--accent-dark)" />
            )}
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default WeekBadge;
