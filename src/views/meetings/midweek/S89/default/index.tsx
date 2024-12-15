import { Document, Font, Page, View } from '@react-pdf/renderer';
import { S89Type } from './index.types';
import { useAppTranslation } from '@hooks/index';
import FontBold from '@assets/fonts/Inter-SemiBold.ttf';
import FontRegular from '@assets/fonts/Inter-Regular.ttf';
import styles from '../shared/index.styles';
import S89Header from '../shared/S89Header';
import S89DetailsRow from '../shared/S89DetailsRow';
import S89ToBeGiven from '../shared/S89ToBeGiven';
import S89StudentNote from '../shared/S89StudentNote';
import S89Footer from '../shared/S89Footer';

Font.register({
  family: 'Inter',
  format: 'truetype',
  fonts: [{ src: FontRegular }, { src: FontBold }],
});

Font.registerHyphenationCallback((word) => [word]);

const TemplateS89 = ({ data, lang }: S89Type) => {
  const { t } = useAppTranslation();

  return (
    <Document
      author="sws2apps"
      title="S-89"
      creator="Organized"
      producer="sws2apps (by react-pdf)"
    >
      <Page size={[241.2, 319.68]} style={styles.body}>
        <View style={styles.content}>
          <View>
            <S89Header lang={lang} />

            <View style={styles.details}>
              <S89DetailsRow
                field={`${t('tr_name')}:`}
                value={data.student_name}
              />

              <S89DetailsRow
                field={`${t('tr_assistant')}:`}
                value={data.assistant_name}
              />

              <S89DetailsRow
                field={`${t('tr_date')}:`}
                value={data.assignment_date}
              />

              <S89DetailsRow field={t('tr_partNo')} value={data.part_number} />
            </View>

            <S89ToBeGiven
              main_hall={data.main_hall}
              aux_class_1={!data.main_hall && data.aux_class_1}
              aux_class_2={data.aux_class_2}
            />

            <S89StudentNote />
          </View>

          <S89Footer lang={lang} />
        </View>
      </Page>
    </Document>
  );
};

export default TemplateS89;
