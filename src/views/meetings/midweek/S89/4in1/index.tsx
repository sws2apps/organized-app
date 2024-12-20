import { Fragment } from 'react';
import { Document, Font, Page, View } from '@react-pdf/renderer';
import { S89DataType } from '@definition/schedules';
import { S89Doc4in1Type } from './index.types';
import { useAppTranslation } from '@hooks/index';
import FontBold from '@assets/fonts/Inter-SemiBold.ttf';
import FontRegular from '@assets/fonts/Inter-Regular.ttf';
import styles from '../shared/index.styles';
import S89Header from '../shared/S89Header';
import S89DetailsRow from '../shared/S89DetailsRow';
import S89ToBeGiven from '../shared/S89ToBeGiven';
import S89StudentNote from '../shared/S89StudentNote';
import S89Footer from '../shared/S89Footer';
import stylesCustom from './index.styles';

Font.register({
  family: 'Inter',
  format: 'truetype',
  fonts: [{ src: FontRegular }, { src: FontBold }],
});

Font.registerHyphenationCallback((word) => [word]);

const TemplateS89Doc4in1 = ({ s89Data, lang }: S89Doc4in1Type) => {
  const { t } = useAppTranslation();

  const formatData = () => {
    const data: S89DataType[][] = [];

    for (let i = 0; i < s89Data.length; i += 4) {
      data.push(s89Data.slice(i, i + 4));
    }
    return data;
  };

  return (
    <>
      {s89Data.length > 0 && (
        <Document
          author="sws2apps"
          title="S-89"
          creator="Organized"
          producer="sws2apps (by react-pdf)"
        >
          <Page size="A4" style={{ ...styles.body, ...stylesCustom.page }}>
            {formatData().map((groupedData, groupedIndex) => {
              return (
                <Fragment key={groupedIndex}>
                  {groupedData.map((data, index) => (
                    <View
                      key={data.id}
                      style={{ ...styles.content, ...stylesCustom.content }}
                      break={groupedIndex > 0 && index === 0}
                    >
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
                            align="center"
                          />

                          <S89DetailsRow
                            field={t('tr_partNo', { lng: lang })}
                            value={data.part_number}
                            align="center"
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
                  ))}
                </Fragment>
              );
            })}
          </Page>
        </Document>
      )}
    </>
  );
};

export default TemplateS89Doc4in1;
