import { StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  body: {
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
  headerMidweekMeeting: {
    fontSize: '16px',
  },
  weekContainer: {
    marginBottom: '20px',
  },
  miniLabelBase: {
    color: '#424949',
    fontSize: '7px',
    fontWeight: 'bold',
  },
  rowBase: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: '1px',
  },
  personLabel: {
    color: 'black',
    fontSize: '9px',
    padding: '0 0 0 8px',
    width: '130px',
  },
  weekTitle: {
    fontWeight: 'bold',
    fontSize: '11px',
    color: 'black',
    textTransform: 'uppercase',
    width: '295px',
  },
  weekInfoLabel: {
    fontWeight: 'bold',
    color: 'darkblue',
    fontSize: '11px',
    width: '295px',
  },
  meetingTimeLabel: {
    fontWeight: 'bold',
    color: '#424949',
    fontSize: '8px',
    width: '25px',
    marginRight: '5px',
  },
  bulletPoint: {
    fontSize: '16px',
    fontWeight: 'bold',
    width: '8px',
    marginTop: '-3px',
  },
  meetingPartText: {
    fontSize: '9px',
  },
  meetingSectionText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '10px',
    padding: '2px 0 2px 6px',
    width: '295px',
    textTransform: 'uppercase',
    borderRadius: '2px',
  },
});

export default styles;
