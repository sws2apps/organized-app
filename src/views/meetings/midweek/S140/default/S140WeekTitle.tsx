import { Text } from '@react-pdf/renderer';
import { fontSize } from './fontOverride';
import { S140WeekTitleType } from '../shared/index.types';
import styles from './index.styles';

const S140WeekTitle = ({ title, lang }: S140WeekTitleType) => {
  return (
    <Text
      style={[
        styles.weekTitle,
        { fontSize: fontSize.weekTitle[lang] || fontSize.weekTitle.default },
      ]}
    >
      {title}
    </Text>
  );
};

export default S140WeekTitle;
