import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: '20px',
    height: '100%',
    width: '100%',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '5px',
  },
  headerTittle: {
    color: '#222222',
    fontWeight: 'medium',
    fontSize: '14px',
  },
  headerCongregation: {
    color: '#222222',
    fontWeight: 'medium',
    fontSize: '12px',
  },
  weekContainer: {
    marginBottom: '24px',
  },
  weekHeader: {
    padding: '4px 5px 4px 15px',
    backgroundColor: '#6876BE',
    borderTopLeftRadius: '6px',
    borderTopRightRadius: '6px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weekDateContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  weekDate: {
    color: '#FEFEFE',
    fontWeight: 'bold',
    fontSize: '10px',
    marginLeft: '5px',
  },
  rowContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: '4px',
  },
  timeContainer: {
    width: '32px',
    padding: '3px 0',
    alignSelf: 'stretch',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    fontSize: '8px',
    fontWeight: 'normal',
    textAlign: 'center',
  },
  sourceContainer: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sourceTextContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: '2px',
    flexWrap: 'wrap',
  },
  sourceText: {
    fontSize: '9px',
  },
  sourceDuration: {
    fontSize: '9px',
    color: '#AAAAAA',
  },
  sourceSecondary: {
    fontSize: '9px',
    color: '#757575',
    fontWeight: 'light',
    textAlign: 'right',
  },
  personContainer: {
    width: '145px',
    display: 'flex',
    gap: '4px',
    padding: '2px 0',
  },
  personPrimary: {
    fontSize: '9px',
    letterSpacing: '-0.04px',
    fontWeight: 'medium',
  },
  personSecondary: {
    fontSize: '9px',
    letterSpacing: '-0.04px',
  },
  songContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
  songText: {
    fontSize: '9px',
    fontWeight: 'bold',
    letterSpacing: '-0.04px',
  },
  sectionContainer: {
    paddingTop: '2px',
    paddingBottom: '2px',
    paddingLeft: '15px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '4px',
    flexGrow: 1,
  },
  sectionTitleText: {
    color: '#FEFEFE',
    fontWeight: 'medium',
    fontSize: '9px',
    textTransform: 'uppercase',
  },
  sectionHallContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '4px',
  },
  hallContainer: {
    width: '145px',
    display: 'flex',
    flexDirection: 'column',
  },
  hallName: {
    fontSize: '9px',
    fontWeight: 'bold',
    letterSpacing: '-0.04px',
    color: '#FEFEFE',
  },
  hallCounselor: {
    fontSize: '9px',
    letterSpacing: '-0.06px',
    color: '#FEFEFE',
  },
});

export default styles;
