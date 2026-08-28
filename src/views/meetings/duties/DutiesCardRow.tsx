import { Fragment } from 'react';
import { Line, Svg, Text, View } from '@react-pdf/renderer';
import { DutiesCardRowProps } from './index.types';
import {
  dateWidth,
  MICROPHONE_GROUP_DIVIDER_TOP_PADDING,
  PERSON_GAP,
} from './packDuties';
import styles, {
  DIVIDER_BORDER,
  EVENT_COLOR,
  GROUP_DIVIDER_COLOR,
  TEXT_COLOR,
} from './index.styles';

const DutiesCardRow = ({
  row,
  fontSize,
  divided,
  groupGap,
  dividerWidth,
}: DutiesCardRowProps) => {
  const color = row?.event ? EVENT_COLOR : TEXT_COLOR;

  const dividerHeight = Math.max(0, groupGap - PERSON_GAP);
  const dividerLineY =
    MICROPHONE_GROUP_DIVIDER_TOP_PADDING +
    (dividerHeight - MICROPHONE_GROUP_DIVIDER_TOP_PADDING) / 2;
  const dashWidth = 5;
  const dashGap = 3;
  const dashCount = Math.max(
    2,
    Math.round((dividerWidth + dashGap) / (dashWidth + dashGap))
  );
  const distributedDashGap =
    (dividerWidth - dashCount * dashWidth) / (dashCount - 1);

  return (
    <View
      style={{
        ...styles.cell,
        borderLeft: divided ? DIVIDER_BORDER : 'none',
      }}
    >
      {row && (
        <>
          <View style={{ ...styles.cellDate, width: dateWidth(fontSize) }}>
            <Text style={{ ...styles.date, fontSize, color }}>{row.date}</Text>
          </View>

          <View style={styles.cellPersons}>
            {row.event && (
              <Text style={{ ...styles.person, fontSize, color }}>
                {row.event}
              </Text>
            )}

            {!row.event &&
              row.persons.map((person, index) => {
                const groupChanged =
                  index > 0 &&
                  person.groupId &&
                  person.groupId !== row.persons[index - 1].groupId;

                return (
                  <Fragment key={person.id}>
                    {groupChanged && (
                      <Svg
                        width="100%"
                        height={dividerHeight}
                        viewBox={`0 0 ${dividerWidth} ${dividerHeight}`}
                        preserveAspectRatio="none"
                      >
                        {Array.from({ length: dashCount }, (_, dashIndex) => {
                          const x1 =
                            dashIndex * (dashWidth + distributedDashGap);

                          return (
                            <Line
                              key={dashIndex}
                              x1={x1}
                              y1={dividerLineY}
                              x2={x1 + dashWidth}
                              y2={dividerLineY}
                              stroke={GROUP_DIVIDER_COLOR}
                              strokeWidth={0.5}
                            />
                          );
                        })}
                      </Svg>
                    )}

                    <Text style={{ ...styles.person, fontSize, color }}>
                      {person.name}
                    </Text>

                    {person.note && (
                      <Text
                        style={{
                          ...styles.personNote,
                          fontSize: fontSize - 2,
                        }}
                      >
                        {person.note}
                      </Text>
                    )}
                  </Fragment>
                );
              })}
          </View>
        </>
      )}
    </View>
  );
};

export default DutiesCardRow;
