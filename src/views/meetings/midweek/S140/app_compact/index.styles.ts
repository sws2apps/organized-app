import { Style } from '@react-pdf/types';

export const TIME_WIDTH = 25.5;
export const MIDDLE_WIDTH = 112;
export const NAMES_WIDTH = 150;

// every cell keeps to one line and ends with an ellipsis, so rows keep a fixed height
const line: Style = {
  fontSize: '7px',
  lineHeight: 1.2,
  maxLines: 1,
  textOverflow: 'ellipsis',
  textAlign: 'left',
};

const styles: Record<string, Style> = {
  page: {
    padding: '20px',
  },
  card: {
    borderWidth: '0.75px',
    borderColor: '#CDD3EE',
    borderRadius: '4px',
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6876BE',
    borderTopLeftRadius: '3.25px',
    borderTopRightRadius: '3.25px',
  },
  iconCell: {
    width: `${TIME_WIDTH}px`,
    flexShrink: 0,
    alignSelf: 'stretch',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...line,
    flex: 1,
    paddingLeft: '4.5px',
    fontSize: '7.2px',
    fontWeight: 600,
    color: '#FEFEFE',
  },
  headerLabel: {
    ...line,
    flexShrink: 0,
    paddingRight: '4px',
    fontWeight: 300,
    color: '#FEFEFE',
  },
  headerName: {
    ...line,
    width: `${NAMES_WIDTH}px`,
    flexShrink: 0,
    paddingRight: '4.5px',
    fontWeight: 500,
    color: '#FEFEFE',
  },
  sectionRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: '0.75px',
  },
  // the icon block runs over the section underline so the two meet without a seam
  sectionIcon: {
    marginBottom: '-0.75px',
  },
  sectionTitle: {
    ...line,
    flex: 1,
    paddingLeft: '4.5px',
    fontSize: '6.75px',
    fontWeight: 600,
    textTransform: 'uppercase',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    ...line,
    fontSize: '6.5px',
    textAlign: 'center',
  },
  title: {
    ...line,
    flex: 1,
    alignSelf: 'center',
    paddingLeft: '4.5px',
    fontWeight: 600,
  },
  duration: {
    fontWeight: 400,
    color: '#AAAAAA',
  },
  middle: {
    width: `${MIDDLE_WIDTH}px`,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: '6px',
  },
  song: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '2px',
  },
  songText: {
    ...line,
    fontSize: '6.5px',
    fontWeight: 600,
    color: '#222222',
  },
  label: {
    ...line,
    fontWeight: 300,
    color: '#757575',
  },
  names: {
    width: `${NAMES_WIDTH}px`,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'row',
    paddingRight: '4.5px',
  },
  primary: {
    ...line,
    fontWeight: 500,
    color: '#222222',
  },
  secondary: {
    ...line,
    color: '#222222',
  },
  classCells: {
    width: `${MIDDLE_WIDTH + NAMES_WIDTH}px`,
    flexShrink: 0,
    alignSelf: 'stretch',
    display: 'flex',
    flexDirection: 'row',
  },
  classCell: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '0 3px',
  },
  classHeader: {
    ...line,
    fontSize: '6.25px',
    fontWeight: 600,
    color: '#956711',
  },
  classCounselor: {
    flex: 1,
    fontWeight: 400,
    color: '#757575',
  },
  hallTag: {
    width: '30px',
    flexShrink: 0,
    textAlign: 'right',
  },
  lineRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  closing: {
    backgroundColor: '#F5F5F5',
    borderBottomLeftRadius: '3.25px',
    borderBottomRightRadius: '3.25px',
  },
};

export type Density = {
  row: number;
  section: number;
  weekGap: number;
  stackNames: boolean;
};

export default styles;
