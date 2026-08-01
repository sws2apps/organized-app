import { StyleSheet } from '@react-pdf/renderer';
import { getCSSPropertyValue } from '@utils/common';

const BORDER_COLOR = '#A5B3DD';
const DIVIDER_COLOR = '#D5DFFD';

export const CARD_RADIUS = getCSSPropertyValue('--radius-s');
export const DIVIDER_BORDER = `0.5px solid ${DIVIDER_COLOR}`;
export const SHADED_ROW_COLOR = '#F8F9FF';
export const EVENT_COLOR = '#8391BD';
export const TEXT_COLOR = '#222222';
export const TITLE_COLOR = '#FEFEFE';

const styles = StyleSheet.create({
  cardsArea: {
    position: 'relative',
    width: '100%',
  },
  cardTitleContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 4px 4px 8px',
    backgroundColor: getCSSPropertyValue('--pdf-blue-main'),
    borderTopLeftRadius: CARD_RADIUS,
    borderTopRightRadius: CARD_RADIUS,
  },
  cardTitle: {
    fontWeight: 500,
    lineHeight: 1.24,
    color: TITLE_COLOR,
  },
  cardLines: {
    display: 'flex',
    flexDirection: 'column',
    borderWidth: '0.5px',
    borderTop: '0px',
    borderColor: BORDER_COLOR,
    borderStyle: 'solid',
    borderBottomLeftRadius: CARD_RADIUS,
    borderBottomRightRadius: CARD_RADIUS,
  },
  cardLine: {
    display: 'flex',
    flexDirection: 'row',
  },
  cell: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  cellDate: {
    padding: '4px 4px 4px 8px',
    borderRight: DIVIDER_BORDER,
  },
  cellPersons: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    padding: '4px 4px 4px 6px',
    gap: '2px',
  },
  date: {
    fontWeight: 500,
    lineHeight: 1.1,
  },
  person: {
    fontWeight: 400,
    lineHeight: 1.1,
  },
});

export default styles;
