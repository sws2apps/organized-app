import { Document, Font, Page, View } from '@react-pdf/renderer';
import { S89Type } from './index.types';
import { useAppTranslation } from '@hooks/index';
import FontBold from '@assets/fonts/Inter-SemiBold.ttf';
import FontRegular from '@assets/fonts/Inter-Regular.ttf';
import styles from './index.styles';
import S89Header from './S89Header';
import S89DetailsRow from './S89DetailsRow';
import S89ToBeGiven from './S89ToBeGiven';
import S89StudentNote from './S89StudentNote';
import S89Footer from './S89Footer';

Font.register({
  family: 'Inter',
  format: 'truetype',
  fonts: [{ src: FontRegular }, { src: FontBold }],
});

Font.registerHyphenationCallback((word) => [word]);

const S89 = ({ s89Data }: S89Type) => {
  const { t } = useAppTranslation();

  return (
    <>
      {s89Data.length > 0 && (
        <Document
          author="sws2apps"
          title="S-89"
          creator="Organized"
          producer="sws2apps (by react-pdf)"
        >
          {s89Data.map((data) => (
            <Page key={data.id} size={[241.2, 319.68]} style={styles.body}>
              <View style={styles.content}>
                <View>
                  <S89Header />

                  <View style={styles.details}>
                    <S89DetailsRow
                      field={t('name')}
                      value={data.student_name}
                    />

                    <S89DetailsRow
                      field={t('assistant')}
                      value={data.assistant_name}
                    />

                    <S89DetailsRow
                      field={t('date')}
                      value={data.assignment_date}
                      align="center"
                    />

                    <S89DetailsRow
                      field={t('partNo')}
                      value={data.part_number}
                      align="center"
                    />
                  </View>

                  <S89ToBeGiven
                    main_hall={data.main_hall}
                    aux_class_1={data.aux_class_1}
                    aux_class_2={data.aux_class_2}
                  />

                  <S89StudentNote />
                </View>

                <S89Footer />
              </View>
            </Page>
          ))}
        </Document>
      )}
    </>
  );
};

export default S89;
