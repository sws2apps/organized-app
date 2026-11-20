import { StyleSheet } from '@react-pdf/renderer';

// the values come straight from the S-12 card in Figma, in points
export const CARD = {
  padding: 9,
  // the heading's capitals sit as far below the top edge as the map does from the sides
  mapTop: 29,
  footerHeight: 38,
};

// the small chips on a card front share one height, however they are drawn
export const CHIP_HEIGHT = 13;

export const COLORS = {
  text: '#222222',
  muted: '#757575',
  note: '#505050',
  line: '#dadada',
  divider: '#E2E2E2',
  paper: '#FEFEFE',
  chip: '#F0F0F0',
  zebra: '#F8F8F8',
  dncText: '#CA2626',
  dncChip: '#F7D8D8',
  numberChip: '#F2F5FF',
  numberText: '#3B4CA3',
};

const styles = StyleSheet.create({
  title: {
    fontSize: 11,
    fontWeight: 600,
    textAlign: 'center',
    color: COLORS.text,
  },
  labelName: { fontSize: 10, fontWeight: 600, color: COLORS.text },
  households: { fontSize: 9, fontWeight: 500, color: COLORS.text },
  fine: { fontSize: 9, fontWeight: 400, color: COLORS.muted },
  a5CareMessage: { fontSize: 8, fontWeight: 400, color: COLORS.muted },
  frameTitle: { fontSize: 9, fontWeight: 400, color: COLORS.muted },
  frameName: { fontSize: 9, fontWeight: 600, color: COLORS.text },
  frameNote: {
    fontSize: 7,
    fontWeight: 400,
    color: COLORS.muted,
  },
  chipText: { fontSize: 9, fontWeight: 600 },
  columnTitle: { fontSize: 8, fontWeight: 400, color: COLORS.muted },
  rowAddress: { fontSize: 9, fontWeight: 600, color: COLORS.text },
  rowText: { fontSize: 9, fontWeight: 300, color: COLORS.text },
  row: {
    flexDirection: 'row',
    gap: 2,
    paddingTop: 5,
    paddingBottom: 5,
    borderBottom: `1px solid ${COLORS.line}`,
  },
  noteText: { fontSize: 7, fontWeight: 400, color: COLORS.text },
  printedOn: { fontSize: 7, fontWeight: 500, color: COLORS.note },
  number: { fontSize: 8, fontWeight: 600, color: COLORS.numberText },
  phone: { fontSize: 10, fontWeight: 500, color: COLORS.text },
});

export default styles;
