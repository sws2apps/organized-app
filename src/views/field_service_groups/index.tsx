import { Document, Font, Page, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { TemplateFieldServiceGroupsType } from './index.types';
import FontLight from '@assets/fonts/Inter-Light.ttf';
import FontRegular from '@assets/fonts/Inter-Regular.ttf';
import FontMedium from '@assets/fonts/Inter-Medium.ttf';
import FontSemiBold from '@assets/fonts/Inter-SemiBold.ttf';
import FSGGroup from './FSGGroup';
import PageHeader from './PageHeader';
import styles from './index.styles';

Font.register({
  family: 'Inter',
  format: 'truetype',
  fonts: [
    { src: FontLight, fontWeight: 'light' },
    { src: FontRegular, fontWeight: 'normal' },
    { src: FontMedium, fontWeight: 'medium' },
    { src: FontSemiBold, fontWeight: 'semibold' },
  ],
});

const TemplateFieldServiceGroups = ({
  congregation,
  groups,
}: TemplateFieldServiceGroupsType) => {
  const { t } = useAppTranslation();

  return (
    <Document
      author="sws2apps"
      title={t('tr_fieldServiceGroups')}
      creator="Organized"
      producer="sws2apps (by react-pdf)"
    >
      <Page size="A4" style={styles.page}>
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
