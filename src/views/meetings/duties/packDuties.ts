import { PageType } from '@views/components/page/index.types';
import {
  DutiesCardLayoutType,
  DutiesCardPlacementType,
  DutiesScheduleCardType,
  DutiesScheduleRowType,
} from './index.types';

type Orientation = NonNullable<PageType['orientation']>;

type MeasuredRow = { row: DutiesScheduleRowType; height: number };

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const PAGE_PADDING = 20;

// the page header repeats on every page and sits above the cards
const HEADER_RESERVED = 24;

const TITLE_GAP = 6;
const TITLE_PADDING = 12;
const TITLE_LINE_RATIO = 1.24;
const ROW_PADDING = 8;
const ROW_TEXT_PADDING = 10;
const PERSON_GAP = 2;
const BORDER = 1;
const DIVIDER = 0.5;
const LINE_RATIO = 1.1;

// text cannot be measured before rendering, so wrapping is estimated from an
// average glyph width: it errs wide, which costs density but never overflows
const AVERAGE_CHAR_RATIO = 0.55;

// a duty taller than this share of the page gets widened until it fits under it
const SPAN_RATIO: Record<Orientation, number> = {
  portrait: 0.6,
  landscape: 0.4,
};

// widening past this leaves no room for the duties next to it
const MAX_SPAN = 2;

export const CARD_GAP = 15;

// how far apart two stacks may end and still be treated as the same line
const ALIGN_TOLERANCE = 3 * CARD_GAP;

const COLUMN_COUNT: Record<Orientation, number> = {
  portrait: 3,
  landscape: 4,
};

export const pageBox = (orientation: Orientation) => {
  const width = orientation === 'landscape' ? A4_HEIGHT : A4_WIDTH;
  const height = orientation === 'landscape' ? A4_WIDTH : A4_HEIGHT;

  return {
    width: width - 2 * PAGE_PADDING,
    height: height - 2 * PAGE_PADDING - HEADER_RESERVED - CARD_GAP,
  };
};

export const cardWidth = (orientation: Orientation, span = 1) => {
  const columns = COLUMN_COUNT[orientation];

  const base =
    (pageBox(orientation).width - CARD_GAP * (columns - 1)) / columns;

  return span * base + (span - 1) * CARD_GAP;
};

// wide enough for a two-digit date and a short month name without wrapping
export const dateWidth = (fontSize: number) => fontSize * 5.6;

export const iconSize = (fontSize: number) => fontSize + 4;

const lineHeight = (fontSize: number) => fontSize * LINE_RATIO;

const textLines = (text: string, fontSize: number, width: number) =>
  Math.max(1, Math.ceil((text.length * AVERAGE_CHAR_RATIO * fontSize) / width));

const titleHeight = (
  card: DutiesScheduleCardType,
  fontSize: number,
  width: number
) => {
  const textWidth =
    width - TITLE_PADDING - TITLE_GAP - iconSize(fontSize) - BORDER;

  const lines = textLines(card.name, fontSize, textWidth);

  return TITLE_PADDING + lines * fontSize * TITLE_LINE_RATIO;
};

const rowHeight = (
  row: DutiesScheduleRowType,
  fontSize: number,
  width: number
) => {
  const textWidth =
    width - dateWidth(fontSize) - ROW_TEXT_PADDING - DIVIDER - BORDER;

  const lines = row.event
    ? textLines(row.event, fontSize, textWidth)
    : row.persons.reduce(
        (total, person) => total + textLines(person.name, fontSize, textWidth),
        0
      );

  const gaps = Math.max(0, row.persons.length - 1) * PERSON_GAP;

  return (
    ROW_PADDING + Math.max(1, lines) * lineHeight(fontSize) + gaps + DIVIDER
  );
};

// columns hold equal counts, not equal heights: paired rows share a line, so
// an uneven split only buys empty cells at the foot of the shorter column
const balance = (measured: MeasuredRow[], span: number) => {
  const size = Math.ceil(measured.length / span);

  return Array.from({ length: span }, (_, index) =>
    measured.slice(index * size, (index + 1) * size)
  );
};

export const lineCount = <T>(columns: T[][]) =>
  Math.max(...columns.map((column) => column.length));

// paired rows share a line, so a line is as tall as its tallest cell
const columnsHeight = (columns: MeasuredRow[][]) => {
  const lines = Array.from({ length: lineCount(columns) }, (_, index) =>
    Math.max(...columns.map((column) => column[index]?.height ?? 0))
  );

  return lines.reduce((total, height) => total + height, 0);
};

// narrowest layout keeping the duty under the share of the page it may occupy
const spanFor = (
  measured: MeasuredRow[],
  title: number,
  limit: number,
  maxSpan: number
) => {
  for (let span = 1; span < maxSpan; span++) {
    if (title + columnsHeight(balance(measured, span)) <= limit) return span;
  }

  return maxSpan;
};

// a card taller than the page continues on the next one under the same title
const layoutCard = ({
  card,
  fontSize,
  width,
  maxHeight,
  spanLimit,
  maxSpan,
}: {
  card: DutiesScheduleCardType;
  fontSize: number;
  width: number;
  maxHeight: number;
  spanLimit: number;
  maxSpan: number;
}): DutiesCardLayoutType[] => {
  const measured: MeasuredRow[] = card.rows.map((row) => ({
    row,
    height: rowHeight(row, fontSize, width),
  }));

  const title = titleHeight(card, fontSize, width);

  const span = spanFor(measured, title, spanLimit, maxSpan);

  const available = maxHeight - title - BORDER;

  const cards: DutiesCardLayoutType[] = [];

  let remaining = measured;

  while (remaining.length > 0) {
    let take = 0;
    let filled = 0;

    for (const entry of remaining) {
      if (take > 0 && filled + entry.height > available * span) break;

      take += 1;
      filled += entry.height;
    }

    let columns = balance(remaining.slice(0, take), Math.min(span, take));

    while (take > 1 && columnsHeight(columns) > available) {
      take -= 1;
      columns = balance(remaining.slice(0, take), Math.min(span, take));
    }

    cards.push({
      id: `${card.id}_${cards.length}`,
      name: card.name,
      icon: card.icon,
      span: columns.length,
      height: title + BORDER + columnsHeight(columns),
      columns: columns.map((column) => column.map((entry) => entry.row)),
    });

    remaining = remaining.slice(take);
  }

  return cards;
};

type Slot = { column: number; span: number; top: number; height: number };

// cards keep a gap between them, so each one guards the strip below itself too
const collides = (spot: Slot, taken: Slot) =>
  spot.column < taken.column + taken.span &&
  taken.column < spot.column + spot.span &&
  spot.top < taken.top + taken.height + CARD_GAP &&
  taken.top < spot.top + spot.height + CARD_GAP;

// every card bottom opens a line the next card may start on, so the space left
// above a wide card stays reachable instead of being written off with its column
const findSpot = (
  card: DutiesCardLayoutType,
  taken: Slot[],
  columns: number,
  maxHeight: number
) => {
  const lines = [0, ...taken.map((slot) => slot.top + slot.height + CARD_GAP)];

  const spots: Slot[] = [];

  for (const top of lines) {
    if (top + card.height > maxHeight) continue;

    for (let column = 0; column + card.span <= columns; column++) {
      const spot = { column, span: card.span, top, height: card.height };

      if (taken.every((slot) => !collides(spot, slot))) spots.push(spot);
    }
  }

  if (spots.length === 0) return undefined;

  const highest = spots.reduce((best, spot) =>
    spot.top < best.top || (spot.top === best.top && spot.column < best.column)
      ? spot
      : best
  );

  // starting a hair below a neighbour reads as a mistake: share its line instead
  const aligned = spots
    .filter(
      (spot) =>
        spot.column === highest.column &&
        spot.top > highest.top &&
        spot.top - highest.top <= ALIGN_TOLERANCE
    )
    .sort((a, b) => b.top - a.top)
    .at(0);

  return aligned ?? highest;
};

// cards are measured, so the page is packed by hand: every card takes the
// highest free spot, and a card that no longer fits lets the next ones try
const packDuties = (
  duties: DutiesScheduleCardType[],
  fontSize: number,
  orientation: Orientation
) => {
  const { height: maxHeight } = pageBox(orientation);
  const columns = COLUMN_COUNT[orientation];
  const width = cardWidth(orientation);
  const spanLimit = maxHeight * SPAN_RATIO[orientation];

  const remaining = duties.flatMap((card) =>
    layoutCard({
      card,
      fontSize,
      width,
      maxHeight,
      spanLimit,
      maxSpan: Math.min(columns, MAX_SPAN),
    })
  );

  const pages: DutiesCardPlacementType[][] = [];

  while (remaining.length > 0) {
    const taken: Slot[] = [];
    const placements: DutiesCardPlacementType[] = [];

    for (let index = 0; index < remaining.length; ) {
      const card = remaining[index];
      const spot = findSpot(card, taken, columns, maxHeight);

      if (!spot) {
        index += 1;
        continue;
      }

      taken.push(spot);

      placements.push({
        card,
        left: spot.column * (width + CARD_GAP),
        top: spot.top,
      });

      remaining.splice(index, 1);
      index = 0;
    }

    // a measured card always fits an empty page, but should one ever not,
    // give it the page anyway rather than dropping it from the schedule
    if (placements.length === 0) {
      placements.push({ card: remaining[0], left: 0, top: 0 });

      remaining.shift();
    }

    pages.push(placements);
  }

  return pages;
};

export default packDuties;
