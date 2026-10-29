import { Style } from '@react-pdf/types';

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
    borderColor: '#DDE1F2',
    borderRadius: '4px',
  },
  // covers the card border so both share one corner radius
  header: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '6px',
    padding: '2px 6px',
    margin: '-0.75px -0.75px 0 -0.75px',
    backgroundColor: '#6876BE',
    borderTopLeftRadius: '4px',
    borderTopRightRadius: '4px',
  },
  headerTitle: {
    ...line,
    flex: 1,
    fontWeight: 600,
    color: '#FEFEFE',
  },
  headerLabel: {
    ...line,
    fontWeight: 300,
    color: '#FEFEFE',
  },
  headerName: {
    ...line,
    flexShrink: 0,
    maxWidth: '160px',
    fontWeight: 500,
    color: '#FEFEFE',
  },
  closing: {
    paddingTop: '2px',
    borderTopWidth: '0.75px',
    borderTopColor: '#E6E8F0',
  },
  columns: {
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '3px 6px',
  },
  sectionHeader: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '3px',
    paddingBottom: '1.5px',
    marginBottom: '2px',
    borderBottomWidth: '1px',
  },
  sectionIcon: {
    width: '9px',
    height: '9px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '1.5px',
  },
  sectionTitle: {
    ...line,
    flex: 1,
    fontSize: '6.5px',
    fontWeight: 700,
    textTransform: 'uppercase',
  },
  counselor: {
    ...line,
    paddingLeft: '22px',
    color: '#757575',
  },
  item: {
    display: 'flex',
    flexDirection: 'column',
  },
  itemLine: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    ...line,
    width: '22px',
    flexShrink: 0,
    fontSize: '6.5px',
    lineHeight: 1.29,
    paddingTop: '0.4px',
    color: '#8A8A8A',
  },
  title: {
    ...line,
    flex: 1,
    fontWeight: 600,
  },
  duration: {
    fontWeight: 400,
    color: '#AAAAAA',
  },
  names: {
    ...line,
    flex: 1,
    color: '#222222',
  },
  primary: {
    fontWeight: 500,
  },
  classCell: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  auxTag: {
    ...line,
    flexShrink: 0,
    fontSize: '5.5px',
    fontWeight: 600,
    width: '15px',
    color: '#956711',
  },
  label: {
    ...line,
    flexShrink: 0,
    fontWeight: 300,
    color: '#757575',
  },
  stripText: {
    ...line,
    flexShrink: 1,
    color: '#222222',
  },
  song: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '1.5px',
    flexShrink: 0,
  },
  songText: {
    ...line,
    fontWeight: 600,
    color: '#222222',
  },
};

export type Density = {
  weekGap: number;
  itemGap: number;
  padding: number;
  headerGap: number;
};

export default styles;
