import { PropsWithChildren } from 'react';
import { Text, View } from '@react-pdf/renderer';
import { S140SectionType } from './index.types';
import styles from './index.styles';
import { applyRTL, isRTL } from '@views/utils/pdf_utils';

const S140Section = ({
  color,
  icon,
  section,
  secondary,
  children,
  lang,
}: S140SectionType & PropsWithChildren) => {
  const stylesSmart = applyRTL(styles, lang);
  const rtl = isRTL(lang);

  return (
    <>
      <View style={{ ...stylesSmart.sectionContainer, backgroundColor: color }}>
        <View style={stylesSmart.sectionTitleContainer}>
          {icon}
          <Text style={stylesSmart.sectionTitleText}>
            {rtl && '\u200f'}
            {section}
          </Text>
        </View>

        {secondary}
      </View>

      {children}
    </>
  );
};

export default S140Section;
