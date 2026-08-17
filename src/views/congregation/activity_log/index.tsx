import { View, Text } from '@react-pdf/renderer';
import { Document, Page, PageContent } from '@views/components';
import { AppLogEntryType } from '@definition/app_logs';
import { useAppTranslation } from '@hooks/index';
import {
  LOG_ACTION_LABEL_KEY,
  LOG_MODULE_LABEL_KEY,
  LOG_MODULE_PDF_COLOR,
  buildLogChangeText,
  formatLogDate,
  formatLogTime,
} from '@services/app/app_logs';
import styles from './index.styles';

type TemplateActivityLogProps = {
  logs: AppLogEntryType[];
  lang: string;
  dateFormat: string;
  is24h: boolean;
};

const PDF_FALLBACK_COLOR = { bg: '#E8EAF6', text: '#283593' };

const TemplateActivityLog = ({
  logs,
  lang,
  dateFormat,
  is24h,
}: TemplateActivityLogProps) => {
  const { t } = useAppTranslation();

  const dateRange = (() => {
    if (logs.length === 0) return '';
    let min = Infinity;
    let max = -Infinity;
    for (const log of logs) {
      const t = new Date(log.updatedAt).getTime();
      if (t < min) min = t;
      if (t > max) max = t;
    }
    const oldest = formatLogDate(new Date(min).toISOString(), dateFormat);
    const newest = formatLogDate(new Date(max).toISOString(), dateFormat);
    return oldest === newest ? oldest : `${oldest} – ${newest}`;
  })();

  return (
    <Document title={t('tr_activityHistory')} lang={lang}>
      <Page>
        <PageContent gap={4}>
          <View style={styles.header} fixed>
            <Text style={styles.headerTitle}>{t('tr_activityHistory')}</Text>
            <Text style={styles.headerSubtitle}>{dateRange}</Text>
          </View>

          <View style={styles.table}>
            <View style={styles.tableHeader} fixed>
              <Text style={[styles.tableHeaderCell, styles.colName]}>
                {t('tr_name')}
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colArea]}>
                {t('tr_area')}
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colAction]}>
                {t('tr_action')}
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colChange]}>
                {t('tr_change')}
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colDate]}>
                {t('tr_date')}
              </Text>
              <Text style={[styles.tableHeaderCell, styles.colTime]}>
                {t('tr_time')}
              </Text>
            </View>

            {logs.map((entry, index) => {
              const badge = LOG_MODULE_PDF_COLOR[entry.module] ?? PDF_FALLBACK_COLOR;

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

                  <View style={styles.colArea}>
                    <View style={[styles.badge, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.badgeText, { color: badge.text }]}>
                        {t(LOG_MODULE_LABEL_KEY[entry.module] ?? entry.module)}
                      </Text>
                    </View>
                  </View>

                  <Text style={[styles.cell, styles.colAction]}>
                    {t(LOG_ACTION_LABEL_KEY[entry.action] ?? entry.action)}
                  </Text>

                  <Text style={[styles.cell, styles.colChange]}>
                    {buildLogChangeText(entry, t)}
                  </Text>

                  <Text style={[styles.cellMuted, styles.colDate]}>
                    {formatLogDate(entry.updatedAt, dateFormat)}
                  </Text>

                  <Text style={[styles.cellMuted, styles.colTime]}>
                    {formatLogTime(entry.updatedAt, is24h)}
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
