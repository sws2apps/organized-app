import { Text, View } from '@react-pdf/renderer';
import styles from './styles';
import S89Class from './S89Class';
import { useTranslation } from 'react-i18next';
import { Setting } from '../../classes/Setting';

const S89ToBeGiven = ({ data }) => {
  const { t } = useTranslation('source');

  const { source_lang } = Setting;

  return (
    <View style={styles.toBeGiven}>
      <Text>{t('s89ToBeGiven', { lng: source_lang })} </Text>
      <View style={styles.classes}>
        <S89Class name={t('mainHall', { lng: source_lang })} checked={data.isMainHall} />
        <S89Class name={t('auxClass1', { lng: source_lang })} checked={data.isAuxClass} />
        <S89Class name={t('auxClass2', { lng: source_lang })} />
      </View>
    </View>
  );
};

export default S89ToBeGiven;
