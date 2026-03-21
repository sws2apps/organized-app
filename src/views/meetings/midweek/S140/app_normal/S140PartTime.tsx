import { Text, View } from '@react-pdf/renderer';
import { S140PartTimeType } from './index.types';
import styles from './index.styles';
import { applyRTL } from '@views/utils/pdf_utils';

const S140PartTime = ({
  time,
  color,
  backgroundColor,
  isClosingSong,
  lang,
}: S140PartTimeType) => {
  const stylesSmart = applyRTL(styles, lang);

  const conditionalStyle = applyRTL(
    isClosingSong ? { borderBottomLeftRadius: 6 } : {},
    lang
  );

  return (
    <View
      style={{
        ...stylesSmart.timeContainer,
        backgroundColor,
        ...conditionalStyle,
      }}
    >
      <Text style={{ ...stylesSmart.timeText, color }}>{time}</Text>
    </View>
  );
};

export default S140PartTime;
