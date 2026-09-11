import { Text, View } from '@react-pdf/renderer';
import { S140PersonType } from '../shared/index.types';
import styles from './index.styles';
import { applyRTL, isRTL } from '@views/utils/pdf_utils';

const S140Person = ({
  primary,
  secondary,
  direction = 'column',
  lang,
}: S140PersonType) => {
  const stylesSmart = applyRTL(styles, lang);
  const isRtl = isRTL(lang);

  return (
    <View
      style={{
        ...stylesSmart.personContainer,
        ...applyRTL({ flexDirection: direction }, lang),
        gap: direction === 'column' ? '2px' : '4px',
      }}
    >
      <Text style={stylesSmart.personPrimary}>
        {isRtl ? '\u200f' : ''}
        {primary}
      </Text>
      {secondary && (
        <Text style={stylesSmart.personSecondary}>
          {isRtl ? '\u200f' : ''}
          {secondary}
        </Text>
      )}
    </View>
  );
};

export default S140Person;
