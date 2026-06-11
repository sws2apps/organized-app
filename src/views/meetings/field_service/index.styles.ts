import { StyleSheet } from '@react-pdf/renderer';

const BORDER_COLOR = '#D5DFFD';
const DIVIDER_COLOR = '#EEF2FF';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 32,
    backgroundColor: '#F6F7FB',
    fontSize: 9,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTexts: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: '#222222',
  },
  headerSubtitle: {
    fontSize: 9,
    fontWeight: 400,
    color: '#4B5563',
    marginTop: 3,
  },
  groupPill: {
    backgroundColor: '#6876BE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 2,
  },
  groupPillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 500,
  },
  monthsContainer: {
    flexDirection: 'column',
  },
  monthSection: {
    marginBottom: 14,
  },
  monthTitle: {
    width: '30%',
    fontSize: 11,
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
    paddingVertical: 5,
    borderTopRightRadius: 4,
  },
  headerDateCol: {
    width: '15%',
    paddingHorizontal: 8,
  },
  headerTimeCol: {
    width: '17%',
    paddingHorizontal: 8,
    borderLeft: `1px solid ${BORDER_COLOR}`,
  },
  headerAddressCol: {
    flex: 1,
    paddingHorizontal: 8,
    borderLeft: `1px solid ${BORDER_COLOR}`,
  },
  headerConductorCol: {
    width: '28%',
    paddingHorizontal: 8,
    borderLeft: `1px solid ${BORDER_COLOR}`,
  },
  headerCell: {
    fontSize: 8,
    fontWeight: 600,
    color: '#3B4CA3',
  },
  emptyNote: {
    fontSize: 9,
    fontWeight: 400,
    color: '#4B5563',
    paddingVertical: 12,
  },
  tableBody: {
    flexDirection: 'column',
    borderBottom: `1px solid ${BORDER_COLOR}`,
    borderRight: `1px solid ${BORDER_COLOR}`,
    borderLeft: `1px solid ${BORDER_COLOR}`,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  dayRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottom: `1px solid ${BORDER_COLOR}`,
  },
  dayRowLast: {
    borderBottomWidth: 0,
  },
  dateColumn: {
    width: '15%',
    backgroundColor: '#F5F3FF',
    borderRight: `1px solid ${BORDER_COLOR}`,
    paddingVertical: 8,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 8,
    fontWeight: 500,
    color: '#312E81',
  },
  timeColumn: {
    width: '17%',
    flexDirection: 'column',
    borderRight: `1px solid ${BORDER_COLOR}`,
  },
  addressColumn: {
    flex: 1,
    flexDirection: 'column',
    borderRight: `1px solid ${BORDER_COLOR}`,
  },
  conductorColumn: {
    width: '28%',
    flexDirection: 'column',
  },
  subCell: {
    paddingVertical: 7,
    paddingHorizontal: 8,
    fontSize: 9,
    fontWeight: 400,
    color: '#1F2937',
    flexGrow: 1,
  },
  subCellDivider: {
    borderBottom: `1px solid ${DIVIDER_COLOR}`,
  },
});

export default styles;
