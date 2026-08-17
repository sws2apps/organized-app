import { Text, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import S89Class from './S89Class';
import styles from './index.styles';
import { S89ToBeGivenType } from './index.types';
import { applyRTL, isRTL } from '@views/utils/pdf_utils';

const S89ToBeGiven = ({ main_hall, aux_class_1, lang }: S89ToBeGivenType) => {
  const { t } = useAppTranslation();
  const rtlStyles = applyRTL(styles, lang);
  const rtl = isRTL(lang);

  return (
    <View style={rtlStyles.toBeGiven}>
      <Text>
        {rtl && '\u200f'}
        {t('tr_s89ToBeGiven', { lng: lang })}
        {rtl && '\u200f'}
        {' '}
      </Text>
      <View style={rtlStyles.classes}>
        <S89Class lang={lang} name={t('tr_mainHall', { lng: lang })} checked={main_hall} />
        <S89Class
          lang={lang}
          name={t('tr_auxClass1', { lng: lang })}
          checked={aux_class_1}
        />
        <S89Class lang={lang} name={t('tr_auxClass2', { lng: lang })} />
      </View>
    </View>
  );
};

export default S89ToBeGiven;
