import { Text, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import S89Class from './S89Class';
import styles from './index.styles';
import { S89ToBeGivenType } from './index.types';

const S89ToBeGiven = ({ main_hall, aux_class_1, lang }: S89ToBeGivenType) => {
  const { t } = useAppTranslation();

  return (
    <View style={styles.toBeGiven}>
      <Text>{t('tr_s89ToBeGiven', { lng: lang })} </Text>
      <View style={styles.classes}>
        <S89Class name={t('tr_mainHall', { lng: lang })} checked={main_hall} />
        <S89Class
          name={t('tr_auxClass1', { lng: lang })}
          checked={aux_class_1}
        />
        <S89Class name={t('tr_auxClass2', { lng: lang })} />
      </View>
    </View>
  );
};

export default S89ToBeGiven;
