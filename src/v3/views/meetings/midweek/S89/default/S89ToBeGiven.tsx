import { Text, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import S89Class from './S89Class';
import styles from './index.styles';
import { S89ToBeGivenType } from './index.types';

const S89ToBeGiven = ({ main_hall, aux_class_1 }: S89ToBeGivenType) => {
  const { t } = useAppTranslation();

  return (
    <View style={styles.toBeGiven}>
      <Text>{t('tr_s89ToBeGiven')} </Text>
      <View style={styles.classes}>
        <S89Class name={t('tr_mainHall')} checked={main_hall} />
        <S89Class name={t('tr_auxClass1')} checked={aux_class_1} />
        <S89Class name={t('tr_auxClass2')} />
      </View>
    </View>
  );
};

export default S89ToBeGiven;
