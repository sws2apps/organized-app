import { Page, Text, View } from '@react-pdf/renderer';
import { Document } from '@views/components';
import styles from './index.styles';

type S13Entry = {
  publisher: string;
  assignedOn: string;
  completedOn?: string;
};

export type S13Row = {
  number: string;
  lastCompleted?: string;
  entries: S13Entry[];
};

type TemplateS13Props = {
  serviceYear: number;
  createdOn: string;
  rows: S13Row[];
  lang: string;
};

const GROUPS = 4;
const ROWS_PER_PAGE = 20;

const Cell = ({
  width,
  children,
  head = false,
  bold = false,
}: {
  width: number;
  children?: string;
  head?: boolean;
  bold?: boolean;
}) => (
  <View style={[styles.cell, { width }, head ? styles.head : {}]}>
    <Text
      style={[
        styles.text,
        bold ? styles.bold : {},
        head ? styles.headText : {},
      ]}
    >
      {children ?? ''}
    </Text>
  </View>
);

const HeaderRow = () => (
  <View style={[styles.row, { height: 40 }]} fixed>
    <Cell width={35} head>
      No.
    </Cell>
    <Cell width={63} head>
      Last date completed
    </Cell>
    {Array.from({ length: GROUPS }, (_, index) => (
      <View key={index} style={[styles.group, styles.head]}>
        <View style={[styles.groupTop, { height: 18 }]}>
          <Text style={[styles.text, styles.headText]}>Assigned to</Text>
        </View>
        <View style={styles.groupBottom}>
          <View style={[styles.half, { height: 22 }]}>
            <Text style={[styles.text, styles.headText]}>Date assigned</Text>
          </View>
          <View style={[styles.half, styles.halfLast, { height: 22 }]}>
            <Text style={[styles.text, styles.headText]}>Date completed</Text>
          </View>
        </View>
      </View>
    ))}
  </View>
);

const BodyRow = ({ row }: { row: S13Row }) => (
  <View style={[styles.row, { height: 32 }]} wrap={false}>
    <Cell width={35} bold>
      {row.number}
    </Cell>
    <Cell width={63}>{row.lastCompleted}</Cell>
    {Array.from({ length: GROUPS }, (_, index) => {
      const entry = row.entries[index];

      return (
        <View key={index} style={styles.group}>
          <View style={[styles.groupTop, { height: 16 }]}>
            <Text style={styles.text}>{entry?.publisher ?? ''}</Text>
          </View>
          <View style={styles.groupBottom}>
            <View style={[styles.half, { height: 16 }]}>
              <Text style={styles.text}>{entry?.assignedOn ?? ''}</Text>
            </View>
            <View style={[styles.half, styles.halfLast, { height: 16 }]}>
              <Text style={styles.text}>{entry?.completedOn ?? ''}</Text>
            </View>
          </View>
        </View>
      );
    })}
  </View>
);

const TemplateS13 = ({
  serviceYear,
  createdOn,
  rows,
  lang,
}: TemplateS13Props) => {
  const pages = Array.from(
    { length: Math.max(1, Math.ceil(rows.length / ROWS_PER_PAGE)) },
    (_, index) => rows.slice(index * ROWS_PER_PAGE, (index + 1) * ROWS_PER_PAGE)
  );

  return (
    <Document title="S-13" lang={lang}>
      {pages.map((chunk, pageIndex) => (
        <Page key={`page-${pageIndex}`} size="A4" style={styles.page}>
          <Text style={styles.title}>Territory assignment record</Text>

          <View style={styles.meta}>
            <Text style={styles.year}>Service year: {serviceYear}</Text>
            <Text style={styles.created}>Created: {createdOn}</Text>
          </View>

          <View style={styles.table}>
            <HeaderRow />
            {chunk.map((row, index) => (
              <BodyRow key={`${row.number}-${index}`} row={row} />
            ))}
          </View>

          <View style={styles.footer}>
            <Text style={styles.created}>S-13</Text>
            <Text style={styles.created}>{pageIndex + 1}</Text>
          </View>
        </Page>
      ))}
    </Document>
  );
};

export default TemplateS13;
