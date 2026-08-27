import { Text as PdfText, View } from '@react-pdf/renderer';
import { useAppTranslation } from '@hooks/index';
import { S89StudentNoteProps } from './index.types';
import styles from './index.styles';
import { applyRTL, isRTL } from '@views/utils/pdf_utils';

const RICH_TEXT_REGEX = /((?:<b>.*?<\/b>)|(?:<i>.*?<\/i>))/g;

const S89StudentNote = ({ lang }: S89StudentNoteProps) => {
  const { t } = useAppTranslation();
  const text = `${isRTL(lang) ? '\u200f' : ''}${t('tr_s89DescFooter', { lng: lang })}`;

  const parts = text.split(RICH_TEXT_REGEX).filter(Boolean);
  const rtlStyles = applyRTL(styles, lang);

  return (
    <View style={rtlStyles.studentNote}>
      <PdfText>
        {parts.map((part, index) => {
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
            <PdfText key={`${index}-${part}`} style={style}>
              {content}
            </PdfText>
          );
        })}
      </PdfText>
    </View>
  );
};

export default S89StudentNote;
