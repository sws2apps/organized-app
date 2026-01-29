import { useMemo } from 'react';
import { Text as PdfText, View } from '@react-pdf/renderer';
import { nanoid } from 'nanoid';
import { useAppTranslation } from '@hooks/index';
import { S89StudentNoteProps } from './index.types';
import styles from './index.styles';

const RICH_TEXT_REGEX = /((?:<b>.*?<\/b>)|(?:<i>.*?<\/i>))/g;

const S89StudentNote = ({ lang }: S89StudentNoteProps) => {
  const { t } = useAppTranslation();
  const text = t('tr_s89DescFooter', { lng: lang });

  const parts = useMemo(() => {
    return text
      .split(RICH_TEXT_REGEX)
      .filter(Boolean)
      .map((part) => ({ id: nanoid(), text: part }));
  }, [text]);

  return (
    <View style={styles.studentNote}>
      <PdfText>
        {parts.map(({ id, text: part }) => {
          let content = part;
          let style = {};

          if (part.startsWith('<b>')) {
            content = part.replaceAll(/<\/?b>/g, '');
            style = { fontWeight: 700 };
          } else if (part.startsWith('<i>')) {
            content = part.replaceAll(/<\/?i>/g, '');
            style = { fontStyle: 'italic' };
          }

          return (
            <PdfText key={id} style={style}>
              {content}
            </PdfText>
          );
        })}
      </PdfText>
    </View>
  );
};

export default S89StudentNote;
