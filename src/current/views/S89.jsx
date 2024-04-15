import { Document, Font, Page, View } from '@react-pdf/renderer';
import RobotoBold from '../fonts/Roboto-Bold.ttf';
import RobotoItalic from '../fonts/Roboto-Italic.ttf';
import RobotoRegular from '../fonts/Roboto-Regular.ttf';
import S89DetailsRow from './S89/S89DetailsRow';
import S89Header from './S89/S89Header';
import styles from './S89/styles';
import S89ToBeGiven from './S89/S89ToBeGiven';
import S89StudentNote from './S89/S89StudentNote';
import S89Footer from './S89/S89Footer';
import { Setting } from '../classes/Setting';
import { useTranslation } from 'react-i18next';

Font.register({
  family: 'Roboto',
  format: 'truetype',
  fonts: [
    { src: RobotoRegular },
    {
      src: RobotoItalic,
      fontWeight: 'normal',
      fontStyle: 'italic',
    },
    { src: RobotoBold, fontWeight: 'bold' },
  ],
});

Font.registerHyphenationCallback((word) => [word]);

const S89 = ({ s89Data = [] }) => {
  const { t } = useTranslation('source');

  const { source_lang } = Setting;

  return (
    <>
      {s89Data.length > 0 && (
        <Document
          author="sws2apps"
          title="S-89"
          creator="Congregation Program for Everyone (CPE)"
          producer="sws2apps (by react-pdf)"
        >
          {s89Data.map((data) => (
            <Page key={data.id} size={[241.2, 319.68]} style={styles.body}>
              <View style={styles.content}>
                <View>
                  <S89Header />

                  <View style={styles.details}>
                    <S89DetailsRow field={t('name', { lng: source_lang })} value={data.studentName} />

                    <S89DetailsRow field={t('assistant', { lng: source_lang })} value={data.assistantName} />

                    <S89DetailsRow field={t('date', { lng: source_lang })} value={data.assignmentDate} align="center" />

                    <S89DetailsRow field={t('partNo', { lng: source_lang })} value={data.partNo} align="center" />
                  </View>

                  <S89ToBeGiven data={data} />

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
