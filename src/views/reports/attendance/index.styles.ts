import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  body: {
    padding: '30px 15px',
    fontSize: '10px',
  },
  title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: '15px',
    marginBottom: '20px',
  },
  section: {
    fontWeight: 'bold',
    fontSize: '13px',
    marginBottom: '5px',
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
  },
  topLargeBorder: {
    borderTop: '2px solid black',
  },
  rightLargerBorder: {
    borderRight: '2px solid black',
  },
  bottomLargerBorder: {
    borderBottom: '2px solid black',
  },
  bottomNormalBorder: {
    borderBottom: '1px solid black',
  },
  leftLargerBorder: {
    borderLeft: '2px solid black',
  },
  lineNormalVertical: {
    borderRight: '1px solid black',
    alignSelf: 'stretch',
  },
  tableContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    fontWeight: 'bold',
    fontSize: '9px',
    textAlign: 'center',
  },
  column1: {
    width: '80px',
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  serviceYear: {
    fontSize: '10px',
  },
  column2: {
    flex: 1,
  },
  column3: {
    width: '60px',
  },
  column4: {
    flex: 1,
  },
  month: {
    padding: '3px 3px',
  },
  number: {
    textAlign: 'center',
  },
  bottomMediumBorder: {
    borderBottom: '1.5px solid black',
  },
  columnAverageLabel: {
    flex: 1,
    textAlign: 'right',
    padding: '3px',
    fontWeight: 'bold',
  },
  columnAverageNumber: {
    width: '68px',
  },
});
