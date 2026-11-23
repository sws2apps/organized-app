import { StyleSheet } from '@react-pdf/renderer';

const LINE = '0.5px solid #222222';

const styles = StyleSheet.create({
  page: { padding: 30, backgroundColor: '#FFFFFF' },
  title: {
    fontSize: 14,
    fontWeight: 700,
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#222222',
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 12,
    marginBottom: 8,
  },
  year: { fontSize: 12, fontWeight: 700, color: '#222222' },
  created: { fontSize: 8, fontWeight: 500, color: '#505050' },
  table: { borderTop: LINE, borderLeft: LINE },
  row: { flexDirection: 'row' },
  cell: {
    justifyContent: 'center',
    paddingLeft: 2,
    paddingRight: 2,
    borderRight: LINE,
    borderBottom: LINE,
  },
  head: { backgroundColor: '#F0F0F0' },
  text: { fontSize: 8, fontWeight: 400, color: '#222222' },
  headText: { fontWeight: 500 },
  bold: { fontWeight: 600 },
  group: { width: 109.25, borderRight: LINE, borderBottom: LINE },
  groupTop: {
    justifyContent: 'center',
    paddingLeft: 2,
    borderBottom: LINE,
  },
  groupBottom: { flexDirection: 'row' },
  half: {
    width: '50%',
    justifyContent: 'center',
    paddingLeft: 2,
    borderRight: LINE,
  },
  halfLast: { borderRight: 'none' },
  footer: {
    position: 'absolute',
    left: 30,
    right: 30,
    bottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default styles;
