import { Text, View } from '@react-pdf/renderer';
import { applyRTL, isRTL } from '@views/utils/pdf_utils';
import IconSong from '@views/components/icons/IconSong';
import { S140NamesType, S140RowType, S140SongTitleType } from './index.types';
import { S140_COLORS } from '../shared/index.utils';
import styles from './index.styles';

const BORDER = `0.5px solid ${S140_COLORS.ministry.main}`;

const corners = (index: number, count: number) => ({
  borderTopLeftRadius: index === 0 ? '4px' : 0,
  borderTopRightRadius: index === count - 1 ? '4px' : 0,
});

export const S140SongTitle = ({ song, title }: S140SongTitleType) => (
  <View style={styles.song}>
    <IconSong />
    <Text style={styles.songLine}>
      <Text style={styles.songNumber}>{song}</Text>
      {title && <Text style={styles.songTitle}> – {title}</Text>}
    </Text>
  </View>
);

const S140Names = ({
  primary,
  secondary,
  lang,
}: S140NamesType & { lang: string }) => {
  const stylesSmart = applyRTL(styles, lang);

  return (
    <>
      <Text style={stylesSmart.primary}>{primary}</Text>
      {secondary && <Text style={stylesSmart.secondary}>{secondary}</Text>}
    </>
  );
};

const S140Row = ({
  time,
  timeColor,
  timeBackground,
  title,
  titleNode,
  titleColor,
  duration,
  reference,
  text,
  labels,
  names,
  classrooms,
  classNames,
  backgroundColor,
  last,
  lang,
}: S140RowType) => {
  const stylesSmart = applyRTL(styles, lang);
  const rtl = isRTL(lang);

  const rounded = last
    ? { borderBottomLeftRadius: '6px', borderBottomRightRadius: '6px' }
    : {};

  return (
    <View
      style={[
        stylesSmart.row,
        { backgroundColor },
        // lets the classroom cells set the row height
        classNames ? { alignItems: 'stretch' } : {},
        rounded,
      ]}
      wrap={false}
    >
      <View
        style={[
          stylesSmart.time,
          { backgroundColor: timeBackground },
          applyRTL(last ? { borderBottomLeftRadius: '6px' } : {}, lang),
        ]}
      >
        <Text style={[stylesSmart.timeText, { color: timeColor }]}>{time}</Text>
      </View>

      <View style={stylesSmart.content}>
        <View style={stylesSmart.titleLine}>
          {titleNode}
          {title && (
            <Text style={[stylesSmart.title, { color: titleColor }]}>
              {rtl && '\u200f'}
              {title}
              {duration && (
                <Text style={stylesSmart.duration}> ({duration})</Text>
              )}
            </Text>
          )}
        </View>

        {reference && (
          <Text style={stylesSmart.reference}>
            {rtl && '\u200f'}
            {reference}
          </Text>
        )}

        {text && (
          <Text style={stylesSmart.text}>
            {rtl && '\u200f'}
            {text}
          </Text>
        )}
      </View>

      {classNames ? (
        <View style={stylesSmart.classCells}>
          {classNames.map((cell, index) => (
            <View
              key={index}
              style={[
                stylesSmart.classCell,
                applyRTL(
                  {
                    borderLeft: BORDER,
                    borderRight:
                      index === classNames.length - 1 ? BORDER : undefined,
                    ...(classrooms && {
                      borderTop: BORDER,
                      ...corners(index, classNames.length),
                    }),
                  },
                  lang
                ),
              ]}
            >
              {classrooms && (
                <View
                  style={[
                    stylesSmart.classHeader,
                    applyRTL(corners(index, classNames.length), lang),
                  ]}
                >
                  <Text style={stylesSmart.className}>
                    {rtl && '\u200f'}
                    {classrooms[index].name}
                  </Text>
                  {classrooms.some((classroom) => classroom.counselor) && (
                    <Text style={stylesSmart.classCounselor}>
                      {rtl && '\u200f'}
                      {[classrooms[index].counselor, classrooms[index].group]
                        .filter(Boolean)
                        .join(' · ') || ' '}
                    </Text>
                  )}
                </View>
              )}
              <View style={stylesSmart.classNames}>
                <S140Names {...cell} lang={lang} />
              </View>
            </View>
          ))}
        </View>
      ) : (
        <>
          {labels && labels.length > 0 && (
            <View style={stylesSmart.labels}>
              {labels.map((label) => (
                <Text key={label} style={stylesSmart.label}>
                  {rtl && '\u200f'}
                  {label}
                </Text>
              ))}
            </View>
          )}
          <View style={stylesSmart.names}>
            <S140Names {...names} lang={lang} />
          </View>
        </>
      )}
    </View>
  );
};

export default S140Row;
