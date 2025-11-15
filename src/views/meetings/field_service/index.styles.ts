import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 32,
    backgroundColor: '#F6F7FB',
    fontSize: 10,
    color: '#1F2937',
  },
  header: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerMain: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#4338CA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTexts: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: '#222222',
  },
  headerSubtitle: {
    fontSize: 10,
    color: '#4B5563',
    marginTop: 4,
  },
  groupPill: {
    backgroundColor: '#6876BE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 2,
  },
  groupPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 600,
  },
  monthsContainer: {
    flexDirection: 'column',
  },
  monthSection: {
    marginBottom: 14,
  },
  monthTitle: {
    width: '30%',
    fontSize: 12,
    fontWeight: 600,
    color: 'white',
    backgroundColor: '#6876BE',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    paddingLeft: '60px',
    paddingVertical: '5px',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#D5DFFD',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderTopRightRadius: 4,
  },
  headerCell: {
    fontSize: 9,
    fontWeight: 600,
    color: '#3B4CA3',
  },
  tableBody: {
    display: 'flex',
    flexDirection: 'column',
    borderBottom: '1px solid #D5DFFD',
    borderRight: '1px solid #D5DFFD',
    borderLeft: '1px solid #D5DFFD',
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  dayRow: {
    // TO REMOVE?
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEF2FF',

    borderRight: '1px solid #D5DFFD',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    fontWeight: 'semibold',
  },
  dayRowLast: {
    borderBottomWidth: 0,
  },
  dateColumn: {
    width: '15%',
    backgroundColor: '#F5F3FF',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#D5DFFD',
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 10,
    fontWeight: 600,
    color: '#312E81',
  },
  meetingsColumn: {
    width: '85%',
  },
  meetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  meetingRowLast: {
    borderBottomWidth: 0,
  },
  cell: {
    fontSize: 9,
    color: '#1F2937',
    paddingLeft: '4px',
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: '4px',
    borderRight: '1px solid #D5DFFD',
  },
  cellDate: {
    width: '15%',
    paddingRight: 6,
  },
  cellDateData: {
    backgroundColor: '#F2F5FF',
    color: '#3B4CA3',
  },
  cellTime: {
    width: '20%',
  },
  cellAddress: {
    width: '40%',
    paddingRight: 6,
  },
  cellConductor: {
    width: '40%',
  },
});

export default styles;
