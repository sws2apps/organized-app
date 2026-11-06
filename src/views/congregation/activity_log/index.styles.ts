import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  // Custom header
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  headerTitle: {
    fontWeight: 600,
    fontSize: 12,
    color: '#111111',
  },
  headerSubtitle: {
    fontSize: 8,
    color: '#888888',
    fontWeight: 400,
  },

  // Table
  table: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: '#3B4CA3',
    borderRadius: 2,
    padding: '3px 6px',
    gap: 3,
  },
  tableHeaderCell: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    borderBottom: '0.5px solid #E0E4F5',
    padding: '2.5px 6px',
    gap: 3,
    alignItems: 'center',
    minHeight: 14,
  },
  tableRowEven: {
    backgroundColor: '#F8F9FF',
  },

  // Cell base styles
  cell: {
    fontSize: 7,
    color: '#333333',
    fontWeight: 400,
  },
  cellBold: {
    fontSize: 7,
    color: '#111111',
    fontWeight: 600,
  },
  cellMuted: {
    fontSize: 7,
    color: '#666666',
    fontWeight: 400,
  },

  // Column widths — Name and Change get most space
  colName: { width: '16%' },
  colArea: { width: '10%' },
  colAction: { width: '9%' },
  colChange: { flex: 1 },
  colDate: { width: '11%' },
  colTime: { width: '11%', textAlign: 'right' },

  // Module badge — compact
  badge: {
    padding: '1px 4px',
    borderRadius: 1.5,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 6.5,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
});

export default styles;
