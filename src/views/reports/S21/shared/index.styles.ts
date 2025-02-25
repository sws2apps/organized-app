import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  body: {
    padding: '12px 16px',
    fontSize: '10px',
  },
  cardContainer: {
    width: '550px',
    height: '390px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  header: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '13px',
    marginBottom: '6px',
  },
  headerTwoColumns: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '2px',
  },
  header2ndColumn: {
    width: '200px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerMultiCheckboxes: {
    marginTop: '4px',
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: '24px',
  },
  field: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    flexDirection: 'row',
  },
  label: {
    fontWeight: 'bold',
  },
  checkbox: {
    display: 'flex',
    gap: '4px',
    alignItems: 'center',
    flexDirection: 'row',
  },

  fixedLabel: {
    maxWidth: '100px',
    alignItems: 'flex-start',
  },
  footerText: {
    fontSize: '8px',
  },
  table: {
    border: '2px solid black',
    marginTop: '4px',
  },
  tableRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  lineVertical: {
    borderRight: '1px solid black',
    alignSelf: 'stretch',
  },
  lineHorizontal: {
    borderBottom: '1px solid black',
  },
  columnHeader: {
    textAlign: 'center',
    fontSize: '9px',
  },
  columnTwoRows: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  cell: {
    padding: '2px 4px',
    alignItems: 'center',
  },
  column1: {
    width: '80px',
  },
  column2: {
    width: '65px',
  },
  column3: {
    width: '70px',
  },
  column4: {
    width: '65px',
  },
  column5: {
    width: '90px',
  },
  column6: {
    flex: 1,
  },
  totalRowContainer: {
    flex: 1,
    borderLeft: '2px solid black',
    borderRight: '2px solid black',
    borderBottom: '2px solid black',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentsField: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  totalLabelField: {
    width: '285px',
    justifyContent: 'flex-end',
    padding: '2px 0',
  },
  totalField: {
    width: '89px',
    padding: '2px 0',
  },
});
