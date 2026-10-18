import { Text, View } from '@react-pdf/renderer';
import { S140PersonType } from '@views/meetings/midweek/S140/app_normal/index.types';
import styles from '@views/meetings/midweek/S140/app_normal/index.styles';
import { applyRTL } from '@views/utils/pdf_utils';

const S140Person = ({ primary, secondary, lang }: S140PersonType) => {
  const stylesSmart = applyRTL(styles, lang);

  return (
    <View style={stylesSmart.personContainer}>
      <Text
        style={[
          stylesSmart.personPrimary,
          ...(secondary ? [{ fontWeight: 'bold' as const }] : []),
        ]}
      >
        {primary}
      </Text>
      {secondary && (
        <Text style={stylesSmart.personSecondary}>{secondary}</Text>
      )}
    </View>
  );
};

export default S140Person;
