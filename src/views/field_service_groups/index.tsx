import { Document, Font, Page, View } from '@react-pdf/renderer';
import { LANGUAGE_LIST } from '@constants/index';
import { useAppTranslation } from '@hooks/index';
import { TemplateFieldServiceGroupsType } from './index.types';
import FSGGroup from './FSGGroup';
import PageHeader from './PageHeader';
import styles from './index.styles';

import FontLight from '/assets/fonts/Inter-Light.ttf';
import FontRegular from '/assets/fonts/Inter-Regular.ttf';
import FontMedium from '/assets/fonts/Inter-Medium.ttf';
import FontSemiBold from '/assets/fonts/Inter-SemiBold.ttf';

import NotoSansFontBold from '/assets/fonts/NotoSans-SemiBold.ttf';
import NotoSansFontRegular from '/assets/fonts/NotoSans-Regular.ttf';

import NotoSansSCFontBold from '/assets/fonts/NotoSansSC-SemiBold.ttf';
import NotoSansSCFontRegular from '/assets/fonts/NotoSansSC-Regular.ttf';

import NotoSansJPFontBold from '/assets/fonts/NotoSansJP-SemiBold.ttf';
import NotoSansJPFontRegular from '/assets/fonts/NotoSansJP-Regular.ttf';

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

Font.register({
  family: 'NotoSans',
  format: 'truetype',
  fonts: [{ src: NotoSansFontRegular }, { src: NotoSansFontBold }],
});

Font.register({
  family: 'NotoSansSC',
  format: 'truetype',
  fonts: [{ src: NotoSansSCFontRegular }, { src: NotoSansSCFontBold }],
});

Font.register({
  family: 'NotoSansJP',
  format: 'truetype',
  fonts: [{ src: NotoSansJPFontRegular }, { src: NotoSansJPFontBold }],
});

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
