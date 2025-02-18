import { Document, Font, Page, View } from '@react-pdf/renderer';
import { LANGUAGE_LIST } from '@constants/index';
import { S89Type } from './index.types';
import { useAppTranslation } from '@hooks/index';
import styles from '../shared/index.styles';
import S89Header from '../shared/S89Header';
import S89DetailsRow from '../shared/S89DetailsRow';
import S89ToBeGiven from '../shared/S89ToBeGiven';
import S89StudentNote from '../shared/S89StudentNote';
import S89Footer from '../shared/S89Footer';

import FontBold from '/assets/fonts/Inter-SemiBold.ttf';
import FontRegular from '/assets/fonts/Inter-Regular.ttf';

import NotoSansFontBold from '/assets/fonts/NotoSans-SemiBold.ttf';
import NotoSansFontRegular from '/assets/fonts/NotoSans-Regular.ttf';

import NotoSansSCFontBold from '/assets/fonts/NotoSansSC-SemiBold.ttf';
import NotoSansSCFontRegular from '/assets/fonts/NotoSansSC-Regular.ttf';

import NotoSansJPFontBold from '/assets/fonts/NotoSansJP-SemiBold.ttf';
import NotoSansJPFontRegular from '/assets/fonts/NotoSansJP-Regular.ttf';

Font.register({
  family: 'Inter',
  format: 'truetype',
  fonts: [{ src: FontRegular }, { src: FontBold }],
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

Font.registerHyphenationCallback((word) => [word]);

const TemplateS89 = ({ data, lang }: S89Type) => {
  const { t } = useAppTranslation();

  const font =
    LANGUAGE_LIST.find((record) => record.threeLettersCode === lang)?.font ||
    'Inter';

  return (
    <Document
      author="sws2apps"
      title="S-89"
      creator="Organized"
      producer="sws2apps (by react-pdf)"
    >
      <Page size={[241.2, 319.68]} style={[styles.body, { fontFamily: font }]}>
        <View style={styles.content}>
          <View>
            <S89Header lang={lang} />

            <View style={styles.details}>
              <S89DetailsRow
                field={`${t('tr_name', { lng: lang })}:`}
                value={data.student_name}
              />

              <S89DetailsRow
                field={`${t('tr_assistant', { lng: lang })}:`}
                value={data.assistant_name}
              />

              <S89DetailsRow
                field={`${t('tr_date', { lng: lang })}:`}
                value={data.assignment_date}
              />

              <S89DetailsRow
                field={t('tr_partNo', { lng: lang })}
                value={data.part_number}
              />
            </View>

            <S89ToBeGiven
              lang={lang}
              main_hall={data.main_hall}
              aux_class_1={data.aux_class_1}
              aux_class_2={data.aux_class_2}
            />

            <S89StudentNote lang={lang} />
          </View>

          <S89Footer lang={lang} />
        </View>
      </Page>
    </Document>
  );
};

export default TemplateS89;
