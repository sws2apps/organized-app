import { useAppTranslation } from '@hooks/index';
import { Path, Svg, Text, View } from '@react-pdf/renderer';
import { INFO_PATH } from '@icons/info_path';
import { TerritoryPrintData } from '@views/territories/index.types';
import styles, { COLORS } from '@views/territories/index.styles';
import DoNotCallTable, {
  DoNotCallHeader,
  MoreEntries,
  ROW,
} from '@views/territories/shared/DoNotCallTable';
import { titleOf } from '@views/territories/shared/title';
import { parseDate } from '@features/territories/helpers';

const PADDING = 12;
const GAP = 6;
// title, red header and the table's column row with its border
const CHROME = 12 + 19 + ROW + 2 + GAP * 2;

// react-pdf drops text inside a clipped view, so the ruled lines are counted to fit instead
const noteHeight = (notes: string, width: number) => {
  const perLine = Math.floor((width - PADDING * 2 - 28) / 3.9);
  const lines = notes
    .split('\n')
    .reduce(
      (sum, line) => sum + Math.max(1, Math.ceil(line.length / perLine)),
      0
    );

  return GAP + 10 + lines * 10;
};

const CardBack = ({
  territory,
  width,
  height,
  notes,
  printedOn,
}: {
  territory: TerritoryPrintData;
  width: number;
  height: number;
  notes?: string;
  printedOn: string;
}) => {
  const { t } = useAppTranslation();

  // oldest at the top, as they are written in by hand; what does not fit are the
  // oldest, which stay in the app
  const entries = [...territory.doNotCalls].sort(
    (a, b) =>
      (parseDate(a.date)?.getTime() ?? 0) - (parseDate(b.date)?.getTime() ?? 0)
  );

  const space =
    height - PADDING * 2 - CHROME - (notes ? noteHeight(notes, width) : 0);
  const rows = Math.floor(space / ROW);

  // at least one empty line stays free for writing; when the list is longer than the
  // card, every line is filled and one line's room counts the rest
  const fits = entries.length < rows ? entries.length : rows - 1;
  const shown = entries.slice(entries.length - Math.max(0, fits));
  const blank = shown.length < entries.length ? 0 : rows - shown.length;
  return (
    <View
      style={{
        width,
        height,
        backgroundColor: '#FFFFFF',
        padding: PADDING,
        gap: GAP,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'baseline',
          gap: 8,
        }}
      >
        <Text style={[styles.labelName, { flexGrow: 1, flexBasis: 0 }]}>
          {titleOf(territory)}
        </Text>
        <Text style={styles.printedOn}>
          {t('tr_territoryPrintedOn', { date: printedOn })}
        </Text>
      </View>

      {!!notes && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            backgroundColor: COLORS.chip,
            borderRadius: 3,
            paddingTop: 5,
            paddingBottom: 5,
            paddingLeft: 5,
            paddingRight: 7,
          }}
        >
          <Svg width={11} height={11} viewBox="0 0 24 24">
            <Path d={INFO_PATH} fill={COLORS.note} />
          </Svg>
          <Text style={[styles.noteText, { flexGrow: 1, flexBasis: 0 }]}>
            {notes}
          </Text>
        </View>
      )}

      <DoNotCallHeader count={entries.length} />
      <DoNotCallTable
        entries={shown}
        blank={Math.max(0, blank)}
        phone={territory.type === 'phone'}
      />
      <MoreEntries count={entries.length - shown.length} />
    </View>
  );
};
export default CardBack;
