import { View, Text } from '@react-pdf/renderer';
import { Document, Page, PageContent } from '@views/components';
import { AppLogEntryType } from '@definition/app_logs';
import { useAppTranslation } from '@hooks/index';
import styles from './index.styles';

type TemplateActivityLogProps = {
  logs: AppLogEntryType[];
  congregation: string;
  lang: string;
  dateFormat: string;
  is24h: boolean;
};

const MODULE_BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  settings: { bg: '#D5DFFD', text: '#3B4CA3' },
  persons: { bg: '#D4EDDA', text: '#1B5E20' },
  schedules: { bg: '#FFF3CD', text: '#7B4F00' },
  access: { bg: '#FDDDE0', text: '#B71C1C' },
  reports: { bg: '#E8EAF6', text: '#283593' },
  groups: { bg: '#E8EAF6', text: '#283593' },
  sync: { bg: '#D5DFFD', text: '#3B4CA3' },
};

const MODULE_LABELS: Record<string, string> = {
  settings: 'Settings',
  persons: 'Persons',
  schedules: 'Schedules',
  access: 'Access',
  reports: 'Reports',
  groups: 'Groups',
  sync: 'Sync',
};

const ACTION_LABELS: Record<string, string> = {
  create: 'Added',
  update: 'Edited',
  delete: 'Removed',
  publish: 'Published',
  accepted: 'Accepted',
  sync: 'Synced',
};

const pad = (n: number) => String(n).padStart(2, '0');

const formatDatePDF = (iso: string, dateFormat: string): string => {
  try {
    const date = new Date(iso);
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    return dateFormat
      .replace('yyyy', String(year))
      .replace('MM', month)
      .replace('dd', day);
  } catch {
    return iso.slice(0, 10);
  }
};

const formatTimePDF = (iso: string, is24h: boolean): string => {
  try {
    const date = new Date(iso);
    const h = date.getHours();
    const m = pad(date.getMinutes());
    const s = pad(date.getSeconds());

    if (is24h) return `${pad(h)}:${m}:${s}`;

    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${pad(h12)}:${m}:${s} ${ampm}`;
  } catch {
    return '';
  }
};

/**
 * Build the Change column text — same logic as the UI component.
 */
const buildChangeText = (entry: AppLogEntryType): string => {
  if (
    entry.action === 'update' &&
    entry.field_label &&
    entry.value_before !== undefined &&
    entry.value_after !== undefined
  ) {
    return `${entry.field_label}: ${entry.value_before} → ${entry.value_after}`;
  }

  if (
    entry.action === 'publish' &&
    entry.field_label &&
    entry.value_before !== undefined &&
    entry.value_after !== undefined
  ) {
    return `${entry.field_label}: ${entry.value_before} – ${entry.value_after}`;
  }

  if (entry.action === 'publish' && entry.value_after) {
    return entry.field_label
      ? `${entry.field_label}: ${entry.value_after}`
      : entry.value_after;
  }

  if (
    entry.action === 'create' ||
    entry.action === 'delete' ||
    entry.action === 'accepted'
  ) {
    const cleanDesc = entry.description
      .replace(
        /^(Added|Removed|Created|Granted|Accepted|Revoked)\s+\w+[\s:]+(?:for\s+|to\s+)?/i,
        ''
      )
      .replace(/^(join request from\s+)/i, '');
    return cleanDesc || entry.description;
  }

  return entry.field_label ?? entry.description;
};

const TemplateActivityLog = ({
  logs,
  lang,
  dateFormat,
  is24h,
}: TemplateActivityLogProps) => {
  const { t } = useAppTranslation();

  // Compute the date range from the logs
  const dateRange = (() => {
    if (logs.length === 0) return '';
    const dates = logs.map((l) => new Date(l.updatedAt).getTime());
    const oldest = new Date(Math.min(...dates));
    const newest = new Date(Math.max(...dates));
    const fmtOldest = formatDatePDF(oldest.toISOString(), dateFormat);
    const fmtNewest = formatDatePDF(newest.toISOString(), dateFormat);
    return fmtOldest === fmtNewest
      ? fmtOldest
      : `${fmtOldest} – ${fmtNewest}`;
  })();

  return (
    <Document title={t('tr_activityHistory')} lang={lang}>
      <Page>
        <PageContent gap={4}>
          {/* Custom header — title left, date range right in grey text */}
          <View style={styles.header} fixed>
            <Text style={styles.headerTitle}>
              {t('tr_activityHistory')}
            </Text>
            <Text style={styles.headerSubtitle}>{dateRange}</Text>
          </View>

          <View style={styles.table}>
            {/* Header row */}
            <View style={styles.tableHeader} fixed>
              <Text style={[styles.tableHeaderCell, styles.colName]}>
                Name
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colArea]}>
                Area
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colAction]}>
                Action
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colChange]}>
                Change
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colDate]}>
                Date
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colTime]}>
                Time
              </Text>
            </View>

            {/* Data rows */}
            {logs.map((entry, index) => {
              const badgeColors = MODULE_BADGE_COLORS[entry.module] ?? {
                bg: '#E8EAF6',
                text: '#283593',
              };
              const moduleLabel =
                MODULE_LABELS[entry.module] ?? entry.module;
              const actionLabel =
                ACTION_LABELS[entry.action] ?? entry.action;
              const changeText = buildChangeText(entry);
              const formattedDate = formatDatePDF(
                entry.updatedAt,
                dateFormat
              );
              const formattedTime = formatTimePDF(entry.updatedAt, is24h);

              return (
                <View
                  key={entry.id}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 ? styles.tableRowEven : {},
                  ]}
                  wrap={false}
                >
                  <Text style={[styles.cellBold, styles.colName]}>
                    {entry.actor_name}
                  </Text>

                  <View style={[styles.colArea]}>
                    <View
                      style={[
                        styles.badge,
                        { backgroundColor: badgeColors.bg },
                      ]}
                    >
                      <Text
                        style={[
                          styles.badgeText,
                          { color: badgeColors.text },
                        ]}
                      >
                        {moduleLabel}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.cell, styles.colAction]}>
                    {actionLabel}
                  </Text>

                  <Text style={[styles.cell, styles.colChange]}>
                    {changeText}
                  </Text>

                  <Text style={[styles.cellMuted, styles.colDate]}>
                    {formattedDate}
                  </Text>

                  <Text style={[styles.cellMuted, styles.colTime]}>
                    {formattedTime}
                  </Text>
                </View>
              );
            })}
          </View>
        </PageContent>
      </Page>
    </Document>
  );
};

export default TemplateActivityLog;
