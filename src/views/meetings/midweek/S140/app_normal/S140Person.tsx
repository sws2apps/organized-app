import { Text, View } from '@react-pdf/renderer';
import { S140PersonType } from './index.types';
import styles from './index.styles';
import { applyRTL } from '@views/utils/pdf_utils';

const S140Person = ({
  primary,
  secondary,
  direction = 'row',
  lang,
}: S140PersonType) => {
  const stylesSmart = applyRTL(styles, lang);

  return (
    <View
      style={{
        ...stylesSmart.personContainer,
        ...applyRTL({ flexDirection: direction }, lang),
        gap: direction === 'column' ? '2px' : '4px',
      }}
    >
      <Text style={stylesSmart.personPrimary}>{primary}</Text>
      {secondary && (
        <Text style={stylesSmart.personSecondary}>{secondary}</Text>
      )}
    </View>
  );
};

export default S140Person;
