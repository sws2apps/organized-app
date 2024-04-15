import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    paddingTop: 20,
    paddingBottom: 25,
    paddingHorizontal: 20,
    fontFamily: 'Roboto',
    fontSize: '10px',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    borderBottom: '3px solid black',
    paddingBottom: '2px',
    marginBottom: '12px',
  },
  headerText: {
    fontSize: '16px',
  },
  row: {
    border: '1px solid black',
    display: 'flex',
    flexDirection: 'row',
    minHeight: '30px',
  },
  borderLeft: {
    borderLeft: '1px solid black',
  },
  borderRight: {
    borderRight: '1px solid black',
  },
  borderTop: {
    borderTop: '1px solid black',
  },
  borderBottom: {
    borderBottom: '1px solid black',
  },
  tableHeaderText: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    backgroundColor: '#CCD1D1',
  },
  tableColumn: {
    fontSize: '11px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '2px 5px',
  },
  dateColumn: {
    width: '80px',
    fontWeight: 'bold',
  },
  talkCO: {
    fontWeight: 'bold',
  },
  talkColumn: {
    width: '200px',
    fontSize: '10px',
  },
  talkExtendedColumn: {
    width: '234.5px',
    fontSize: '10px',
  },
  personColumn: {
    width: '130px',
    fontSize: '10px',
  },
  personExtendedColumn: {
    width: '164.5px',
    fontSize: '10px',
  },
  noMeetingColumn: {
    flexGrow: 1,
    fontSize: '12px',
    fontWeight: 'bold',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '2px 5px',
  },
});

export default styles;
