import { StyleSheet } from '@react-pdf/renderer';
import { getCSSPropertyValue } from '@utils/common';

const A4_WIDTH = 595.28;
const PAGE_PADDING = 20;

export const CONTENT_WIDTH = A4_WIDTH - 2 * PAGE_PADDING;

export const BORDER_WIDTH = 0.5;
export const BORDER = `${BORDER_WIDTH}px solid #A5B3DD`;
export const DIVIDER = `${BORDER_WIDTH}px solid #D5DFFD`;

export const BLUE_MAIN = () => getCSSPropertyValue('--pdf-blue-main');
export const RADIUS = () => getCSSPropertyValue('--radius-s');

export const tableRow = ({
  overlap,
  first,
  last,
}: {
  overlap: boolean;
  first: boolean;
  last: boolean;
}) => ({
  marginTop: overlap ? -BORDER_WIDTH : 0,
  borderLeft: BORDER,
  borderRight: BORDER,
  borderTop: first ? BORDER : DIVIDER,
  borderBottom: last ? BORDER : DIVIDER,
  borderTopLeftRadius: first ? RADIUS() : 0,
  borderTopRightRadius: first ? RADIUS() : 0,
  borderBottomLeftRadius: last ? RADIUS() : 0,
  borderBottomRightRadius: last ? RADIUS() : 0,
});

const styles = StyleSheet.create({
  monthHeading: {
    fontSize: 12,
    fontWeight: 600,
    color: '#3B4CA3',
    marginBottom: 6,
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  listDate: {
    width: 105,
    padding: '8px 6px',
    backgroundColor: '#F2F5FF',
    borderRight: DIVIDER,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 10,
    fontWeight: 600,
    color: '#3B4CA3',
  },
  majorDetails: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    minWidth: 0,
    gap: 6,
  },
  majorDetailRow: {
    display: 'flex',
    flexDirection: 'row',
    gap: 16,
  },
  majorDetail: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  },
  majorDetailLabel: {
    fontSize: 8,
    color: '#606D93',
  },
  listContent: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: '6px 16px 6px 6px',
    minHeight: 38,
  },
  badge: {
    padding: '2px 5px',
    maxWidth: 100,
    flexShrink: 0,
    borderRadius: 2,
    fontSize: 8,
    fontWeight: 600,
    color: '#FEFEFE',
  },
  persons: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 1,
  },
  responsible: {
    fontSize: 10,
    fontWeight: 600,
    color: '#222222',
  },
  person: {
    fontSize: 10,
    color: '#222222',
  },
  cardTitle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 4,
    padding: '5px 8px',

    fontSize: 9,
    fontWeight: 600,
    color: '#FEFEFE',
  },
  cardRows: {
    border: BORDER,
    borderTop: 'none',
  },
  cardRow: {
    padding: '4px 8px',
  },
  turnLabel: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '4px',
    minHeight: 24,
    backgroundColor: '#F2F5FF',
    borderLeft: `${BORDER_WIDTH}px solid #F2F5FF`,
    textAlign: 'center',
    fontSize: 8,
    fontWeight: 600,
    color: '#3B4CA3',
  },
  turnsGroup: {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 2,
    padding: '6px',
    minHeight: 28,
  },
  turnCell: {
    borderLeft: DIVIDER,
    backgroundColor: '#F8F9FF',
  },
  leader: {
    fontSize: 8,
    color: '#505050',
  },
});

export default styles;
