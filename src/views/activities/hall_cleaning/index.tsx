import { Page, Text, View } from '@react-pdf/renderer';
import { Document, PageContent } from '@views/components';
import { IconClean } from '@views/components/icons';
import { useAppTranslation } from '@hooks/index';
import { TemplateHallCleaningProps } from './index.types';
import CleaningCards from './CleaningCards';
import CleaningList from './CleaningList';
import CleaningTurns from './CleaningTurns';
import { cleaningScheduleMatrix } from '@utils/cleaning_schedule_matrix';
import CleaningRotation from '@views/activities/hall_cleaning/CleaningRotation';

const TemplateHallCleaning = ({
  congregation,
  lang,
  layout,
  version,
  rows,
  groups,
  turns,
  rowPages,
  onRowPage,
}: TemplateHallCleaningProps) => {
  const { t } = useAppTranslation();

  const matrix = layout === 'turns' ? cleaningScheduleMatrix(rows) : undefined;
  const scheduleTitle = t(
    layout === 'rotation'
      ? 'tr_cleaningRotationSchedule'
      : 'tr_hallCleaningSchedule'
  );
  const title =
    version === 'draft'
      ? `${scheduleTitle} – ${t('tr_scheduleDraft')}`
      : scheduleTitle;

  return (
    <Document title={title} lang={lang}>
      <Page
        size="A4"
        style={{ paddingTop: 20, paddingHorizontal: 20, paddingBottom: 20 }}
      >
        <PageContent gap={12}>
          <View
            fixed
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
                flex: 1,
              }}
            >
              <IconClean size={18} />
              <Text style={{ fontSize: 14, fontWeight: 500, flex: 1 }}>
                {title}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: '#3B4CA3',
                backgroundColor: '#D5DFFD',
                padding: '2px 8px',
                borderRadius: 2,
                maxWidth: '40%',
              }}
            >
              {congregation}
            </Text>
          </View>
          {layout === 'list' && (
            <CleaningList
              rows={rows}
              rowPages={rowPages}
              onRowPage={onRowPage}
            />
          )}
          {layout === 'cards' && <CleaningCards rows={rows} />}
          {layout === 'rotation' && (
            <CleaningRotation
              rows={rows}
              groups={groups}
              turns={turns}
              rowPages={rowPages}
              onRowPage={onRowPage}
            />
          )}
          {matrix && (
            <CleaningTurns
              groups={matrix.groups}
              turns={matrix.turns}
              rowPages={rowPages}
              onRowPage={onRowPage}
            />
          )}
        </PageContent>
      </Page>
    </Document>
  );
};

export default TemplateHallCleaning;
