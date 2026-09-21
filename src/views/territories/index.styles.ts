import { StyleSheet } from '@react-pdf/renderer';

// the values come straight from the S-12 card in Figma, in points
export const CARD = {
  padding: 9,
  headerTop: 8,
  mapTop: 36,
  footerHeight: 28,
};

export const COLORS = {
  text: '#222222',
  muted: '#757575',
  note: '#505050',
  line: '#dadada',
  paper: '#FEFEFE',
  chip: '#F0F0F0',
  dncText: '#CA2626',
  dncChip: '#F7D8D8',
};

const styles = StyleSheet.create({
  title: {
    fontSize: 11,
    fontWeight: 600,
    textAlign: 'center',
    color: COLORS.text,
  },
  metaLabel: { fontSize: 11, fontWeight: 400, color: COLORS.text },
  metaValue: { fontSize: 11, fontWeight: 600, color: COLORS.text },
  households: { fontSize: 9, fontWeight: 500, color: COLORS.text },
  fine: { fontSize: 9, fontWeight: 400, color: COLORS.muted },
  chip: {
    borderRadius: 2,
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 8,
    paddingRight: 8,
    alignSelf: 'flex-start',
  },
  chipText: { fontSize: 10, fontWeight: 600 },
  columnTitle: { fontSize: 10, fontWeight: 400, color: COLORS.muted },
  rowAddress: { fontSize: 10, fontWeight: 500, color: COLORS.text },
  rowText: { fontSize: 10, fontWeight: 400, color: COLORS.text },
  row: {
    flexDirection: 'row',
    gap: 2,
    paddingTop: 5,
    paddingBottom: 5,
    borderBottom: `1px solid ${COLORS.line}`,
  },
  notes: { fontSize: 10, fontWeight: 400, color: COLORS.text },
  qrText: { fontSize: 9, fontWeight: 400, color: COLORS.muted },
  printedOn: { fontSize: 9, fontWeight: 500, color: COLORS.note },
});

export default styles;
