import { Page, Text, View } from '@react-pdf/renderer';
import { Document } from '@views/components';
import { useAppTranslation } from '@hooks/index';
import { LANGUAGE_LIST } from '@constants/index';
import registerFonts from '@views/registerFonts';
import IconService from '@views/components/icons/IconService';
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
    <Document title={t('tr_fieldServiceMeetings', { lng: lang })} lang={lang}>
      <Page size="A4" style={[styles.page, { fontFamily: font }]}>
        <View style={styles.header}>
          <View style={styles.headerMain}>
            <View style={styles.iconWrapper}>
              <IconService />
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
          {months.length === 0 && (
            <Text style={styles.emptyNote}>
              {t('tr_noFieldServiceMeetingsForRange', { lng: lang })}
            </Text>
          )}
          {months.map((month) => (
            <View key={month.id} style={styles.monthSection}>
              <Text style={styles.monthTitle}>{month.title}</Text>
              {/* Table header */}
              <View style={styles.tableHeader}>
                <View style={styles.headerDateCol}>
                  <Text style={styles.headerCell}>
                    {t('tr_date', { lng: lang })}
                  </Text>
                </View>
                <View style={styles.headerTimeCol}>
                  <Text style={styles.headerCell}>
                    {t('tr_timerLabelTime', { lng: lang })}
                  </Text>
                </View>
                <View style={styles.headerAddressCol}>
                  <Text style={styles.headerCell}>
                    {t('tr_address', { lng: lang })}
                  </Text>
                </View>
                <View style={styles.headerConductorCol}>
                  <Text style={styles.headerCell}>
                    {t('tr_conductor', { lng: lang })}
                  </Text>
                </View>
              </View>
              {/* Table body */}
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
                    {/* Date column — spans full row height */}
                    <View style={styles.dateColumn}>
                      <Text style={styles.dateText}>{day.dateLabel}</Text>
                    </View>
                    {/* Parallel columns for full-height dividers */}
                    <View style={styles.timeColumn}>
                      {day.meetings.map((meeting, mIdx) => (
                        <View
                          key={meeting.id}
                          style={[
                            styles.subCell,
                            mIdx < day.meetings.length - 1
                              ? styles.subCellDivider
                              : undefined,
                          ]}
                        >
                          <Text>{meeting.time || ' '}</Text>
                        </View>
                      ))}
                    </View>
                    <View style={styles.addressColumn}>
                      {day.meetings.map((meeting, mIdx) => (
                        <View
                          key={meeting.id}
                          style={[
                            styles.subCell,
                            mIdx < day.meetings.length - 1
                              ? styles.subCellDivider
                              : undefined,
                          ]}
                        >
                          <Text>{meeting.address || ' '}</Text>
                        </View>
                      ))}
                    </View>
                    <View style={styles.conductorColumn}>
                      {day.meetings.map((meeting, mIdx) => (
                        <View
                          key={meeting.id}
                          style={[
                            styles.subCell,
                            mIdx < day.meetings.length - 1
                              ? styles.subCellDivider
                              : undefined,
                          ]}
                        >
                          <Text>{meeting.conductor || ' '}</Text>
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
