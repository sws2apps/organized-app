import { useState } from 'react';
import { Box, Stack } from '@mui/material';
import { pdf } from '@react-pdf/renderer';
import { saveAs } from 'file-saver';
import { useAtomValue } from 'jotai';
import { useAppTranslation } from '@hooks/index';
import { shortDateFormatState, hour24FormatState, congNameState, JWLangLocaleState } from '@states/settings';
import {
  CardSection,
  CardSectionContent,
  CardSectionHeader,
} from '../shared_styles';
import CustomFilterChip from '@components/filter_chip';
import Divider from '@components/divider';
import Typography from '@components/typography';
import NavBarButton from '@components/nav_bar_button';
import useAppLogs from './useAppLogs';
import LogEntry from './log_entry';
import { AppLogFilterType } from '@definition/app_logs';
import WaitingLoader from '@components/waiting_loader';
import { TemplateActivityLog } from '@views/index';
import { displaySnackNotification } from '@services/states/app';
import { getMessageByCode } from '@services/i18n/translation';
import { IconExport } from '@components/icons';

const AppLogs = () => {
  const { t } = useAppTranslation();
  const { logs, filter, setFilter, isLoading, totalCount } = useAppLogs();
  const [isExporting, setIsExporting] = useState(false);

  const dateFormat = useAtomValue(shortDateFormatState);
  const is24h = useAtomValue(hour24FormatState);
  const congName = useAtomValue(congNameState);
  const locale = useAtomValue(JWLangLocaleState);

  const FILTERS: { key: AppLogFilterType; label: string }[] = [
    { key: 'all', label: t('tr_all') },
    { key: 'mine', label: t('tr_myActivity') },
    { key: 'admins', label: t('tr_admins') },
    { key: 'others', label: t('tr_otherUsers') },
  ];

  const handleExport = async () => {
    if (isExporting || logs.length === 0) return;

    try {
      setIsExporting(true);

      const blob = await pdf(
        <TemplateActivityLog
          logs={logs}
          congregation={congName}
          lang={locale}
          dateFormat={dateFormat}
          is24h={is24h}
        />
      ).toBlob();

      const filename = `Activity_History_${new Date().toISOString().slice(0, 10)}.pdf`;
      saveAs(blob, filename);
    } catch (error) {
      console.error(error);
      displaySnackNotification({
        header: getMessageByCode('error_app_generic-title'),
        message: getMessageByCode((error as Error).message),
        severity: 'error',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <CardSection>
      {/* Header row with title + Export button */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
        <CardSectionHeader
          title={t('tr_activityHistory')}
          description={t('tr_activityHistoryDesc')}
        />
        <NavBarButton
          text={t('tr_export')}
          icon={<IconExport />}
          onClick={handleExport}
          disabled={isExporting || logs.length === 0}
        />
      </Box>

      <CardSectionContent>
        {/* Filter chips */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {FILTERS.map(({ key, label }) => (
            <CustomFilterChip
              key={key}
              label={label}
              selected={filter === key}
              onClick={() => setFilter(key)}
            />
          ))}
        </Box>

        <Divider color="var(--accent-200)" />

        {/* Log list */}
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', padding: '24px 0' }}>
            <WaitingLoader />
          </Box>
        ) : logs.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '32px 16px',
            }}
          >
            <Typography
              className="body-small-regular"
              sx={{ color: 'var(--grey-350)', textAlign: 'center' }}
            >
              {totalCount === 0 ? t('tr_noLogs') : t('tr_noLogsForFilter')}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              maxHeight: '480px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--accent-300) transparent',
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-track': { background: 'transparent' },
              '&::-webkit-scrollbar-thumb': {
                background: 'var(--accent-300)',
                borderRadius: '4px',
              },
            }}
          >
            <Stack divider={<Divider color="var(--accent-150)" />}>
              {logs.map((entry) => (
                <LogEntry key={entry.id} entry={entry} />
              ))}
            </Stack>
          </Box>
        )}

        {/* Footer count */}
        {!isLoading && totalCount > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Typography
              className="label-small-regular"
              sx={{ color: 'var(--grey-350)', fontSize: '11px' }}
            >
              {logs.length} / {totalCount} {t('tr_entries')}
            </Typography>
          </Box>
        )}
      </CardSectionContent>
    </CardSection>
  );
};

export default AppLogs;
