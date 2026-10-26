import { StyleSheet } from '@react-pdf/renderer';
import { getCSSPropertyValue } from '@utils/common';

const RADIUS = getCSSPropertyValue('--radius-s');
const BORDER_COLOR = '#D5DFFD';

const styles = StyleSheet.create({
  month: {
    display: 'flex',
    flexDirection: 'column',
  },
  monthHeader: {
    display: 'flex',
    flexDirection: 'column',
  },
  monthName: {
    alignSelf: 'flex-start',
    minWidth: '129px',
    height: '24px',
    padding: '2px 16px',
    backgroundColor: '#6876BE',
    borderTopLeftRadius: RADIUS,
    borderTopRightRadius: RADIUS,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthNameText: {
    fontWeight: 600,
    fontSize: '11px',
    color: '#FEFEFE',
  },
  tableHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 0',
    backgroundColor: BORDER_COLOR,
    borderTopRightRadius: RADIUS,
  },
  headerDateGroup: {
    display: 'flex',
    flexDirection: 'row',
  },
  headerCell: {
    fontWeight: 500,
    fontSize: '10px',
    color: '#3B4CA3',
  },
  dayRow: {
    display: 'flex',
    flexDirection: 'row',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: BORDER_COLOR,
  },
  dayRowLast: {
    borderBottomLeftRadius: RADIUS,
    borderBottomRightRadius: RADIUS,
  },
  dateCell: {
    width: '56px',
    padding: '0 4px 0 8px',
    backgroundColor: '#F2F5FF',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: BORDER_COLOR,
    display: 'flex',
    justifyContent: 'center',
  },
  dateCellLast: {
    borderBottomLeftRadius: RADIUS,
  },
  dateText: {
    fontWeight: 600,
    fontSize: '10px',
    color: '#3B4CA3',
  },
  meetingsColumn: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  meetingRow: {
    display: 'flex',
    flexDirection: 'column',
  },
  meetingDetails: {
    display: 'flex',
    flexDirection: 'row',
    gap: '4px',
  },
  noteText: {
    marginTop: '4px',
    paddingRight: '4px',
    fontSize: '9px',
    lineHeight: 1.24,
    color: '#616161',
  },
  meetingRowDivider: {
    borderBottomWidth: 1,
    borderColor: BORDER_COLOR,
  },
  timeCell: {
    width: '68px',
    padding: '4px 0 4px 8px',
    display: 'flex',
    justifyContent: 'center',
  },
  timeText: {
    fontWeight: 600,
    fontSize: '10px',
    color: '#222222',
  },
  groupCell: {
    width: '124px',
    padding: '4px 0 4px 4px',
    borderLeftWidth: 1,
    borderColor: BORDER_COLOR,
    display: 'flex',
    justifyContent: 'center',
  },
  textCell: {
    width: '147.5px',
    padding: '4px 0 4px 4px',
    borderLeftWidth: 1,
    borderColor: BORDER_COLOR,
    display: 'flex',
    justifyContent: 'center',
  },
  cellText: {
    fontWeight: 400,
    fontSize: '10px',
    lineHeight: 1.24,
    color: '#222222',
  },
  linkText: {
    color: '#3B4CA3',
    textDecoration: 'underline',
  },
  columnDate: {
    width: '56px',
    paddingLeft: '8px',
  },
  columnTime: {
    width: '68px',
    paddingLeft: '8px',
  },
  columnGroup: {
    width: '120px',
  },
  columnText: {
    width: '143.5px',
  },
});

export default styles;
