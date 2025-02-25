import { Document, Page, View } from '@react-pdf/renderer';
import { LANGUAGE_LIST } from '@constants/index';
import { useAppTranslation } from '@hooks/index';
import { TemplateFieldServiceGroupsType } from './index.types';
import registerFonts from '@views/registerFonts';
import FSGGroup from './FSGGroup';
import PageHeader from './PageHeader';
import styles from './index.styles';

registerFonts();

const TemplateFieldServiceGroups = ({
  congregation,
  groups,
  lang,
}: TemplateFieldServiceGroupsType) => {
  const { t } = useAppTranslation();

  const font =
    LANGUAGE_LIST.find((record) => record.threeLettersCode === lang)?.font ||
    'Inter';

  return (
    <Document
      author="sws2apps"
      title={t('tr_fieldServiceGroups')}
      creator="Organized"
      producer="sws2apps (by react-pdf)"
    >
      <Page size="A4" style={[styles.page, { fontFamily: font }]}>
        <View style={styles.contentContainer}>
          <PageHeader congregation={congregation} />
          <View style={styles.groupsContainer}>
            {groups.map((group) => (
              <FSGGroup key={group.group_name} group={group} />
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TemplateFieldServiceGroups;
