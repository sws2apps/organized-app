import { PropsWithChildren } from 'react';
import { Text, View } from '@react-pdf/renderer';
import { S140SectionType } from './index.types';
import styles from './index.styles';

const S140Section = ({
  color,
  icon,
  section,
  secondary,
  children,
}: S140SectionType & PropsWithChildren) => {
  return (
    <>
      <View style={{ ...styles.sectionContainer, backgroundColor: color }}>
        <View style={styles.sectionTitleContainer}>
          {icon}
          <Text style={styles.sectionTitleText}>{section}</Text>
        </View>

        {secondary}
      </View>

      {children}
    </>
  );
};

export default S140Section;
