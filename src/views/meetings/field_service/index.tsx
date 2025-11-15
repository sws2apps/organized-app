import { Page, Text, View } from '@react-pdf/renderer';
import { Document } from '@views/components';
import { useAppTranslation } from '@hooks/index';
import { LANGUAGE_LIST } from '@constants/index';
import registerFonts from '@views/registerFonts';
import IconMinistry from '@views/components/icons/IconMinistry';
import { FieldServiceMeetingTemplateProps } from './index.types';
import styles from './index.styles';

registerFonts();

const TemplateFieldServiceMeetings = ({
  congregation,
  groupLabel,
  lang,
  months,
}: FieldServiceMeetingTemplateProps) => {
  const { t } = useAppTranslation();

  const font =
    LANGUAGE_LIST.find((record) => record.threeLettersCode === lang)?.font ||
    'Inter';

  return (
    <Document title={t('tr_fieldServiceMeetings', { lng: lang })}>
      <Page size="A4" style={[styles.page, { fontFamily: font }]}>
        <View style={styles.header}>
          <View style={styles.headerMain}>
            <View style={styles.iconWrapper}>
              <IconMinistry />
            </View>
            <View style={styles.headerTexts}>
              <Text style={styles.headerTitle}>
                {t('tr_fieldServiceMeetings', { lng: lang })}
              </Text>
              <Text style={styles.headerSubtitle}>{congregation}</Text>
            </View>
          </View>
          {Boolean(groupLabel) && (
            <View style={styles.groupPill}>
              <Text style={styles.groupPillText}>{groupLabel}</Text>
            </View>
          )}
        </View>

        <View style={styles.monthsContainer}>
          {months.map((month) => (
            <View key={month.id} style={styles.monthSection}>
              <Text style={styles.monthTitle}>{month.title}</Text>
              <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, styles.cellDate]}>
                  {t('tr_date', { lng: lang })}
                </Text>
                <Text style={[styles.headerCell, styles.cellTime]}>
                  {t('tr_timerLabelTime', { lng: lang })}
                </Text>
                <Text style={[styles.headerCell, styles.cellAddress]}>
                  {t('tr_address', { lng: lang })}
                </Text>
                <Text style={[styles.headerCell, styles.cellConductor]}>
                  {t('tr_conductor', { lng: lang })}
                </Text>
              </View>
              <View style={styles.tableBody}>
                {month.days.map((day, dayIndex) => (
                  <View
                    key={day.id}
                    style={[
                      styles.dayRow,
                      dayIndex === month.days.length - 1
                        ? styles.dayRowLast
                        : undefined,
                    ]}
                  >
                    <View style={styles.dateColumn}>
                      <Text style={styles.dateText}>{day.dateLabel}</Text>
                    </View>
                    <View style={styles.meetingsColumn}>
                      {day.meetings.map((meeting, meetingIndex) => (
                        <View
                          key={meeting.id}
                          style={[
                            styles.meetingRow,
                            meetingIndex === day.meetings.length - 1
                              ? styles.meetingRowLast
                              : undefined,
                          ]}
                        >
                          <Text style={[styles.cell, styles.cellTime]}>
                            {meeting.time}
                          </Text>
                          <Text style={[styles.cell, styles.cellAddress]}>
                            {meeting.address}
                          </Text>
                          <Text style={[styles.cell, styles.cellConductor]}>
                            {meeting.conductor}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default TemplateFieldServiceMeetings;
