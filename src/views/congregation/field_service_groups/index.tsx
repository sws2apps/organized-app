import { Document, Font, Page, View } from '@react-pdf/renderer';
import FontLight from '@assets/fonts/Inter-Light.ttf';
import FontRegular from '@assets/fonts/Inter-Regular.ttf';
import FontMedium from '@assets/fonts/Inter-Medium.ttf';
import FontSemiBold from '@assets/fonts/Inter-SemiBold.ttf';
import { FieldServiceGroupsDocType } from './shared/index.types';
import { useAppTranslation } from '@hooks/index';
import styles from './shared/index.styles';
import FSGTitle from './shared/FSGTitle';
import FSGGroup from './shared/FSGGroup';

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

const TemplateFieldServiceGroupsDoc = ({
  fieldServiceGroups,
  congregationName,
  persons,
  fullnameOption,
}: FieldServiceGroupsDocType) => {
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
          <FSGTitle congregationName={congregationName} />
          <View style={styles.groupsContainer}>
            {fieldServiceGroups.map((group, groupIndex) => (
              <FSGGroup
                groupNumber={groupIndex + 1}
                data={group}
                persons={persons}
                fullnameOption={fullnameOption}
                key={`fsg-group-${groupIndex}`}
              />
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default TemplateFieldServiceGroupsDoc;
