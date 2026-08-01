import { FieldServiceGroupExportType } from '@definition/field_service_groups';
import { FSGCard, FSGPageOrientation, FSGPlacement } from './index.types';

const A4_WIDTH = 595.28;
const A4_HEIGHT = 841.89;
const PAGE_PADDING = 20;
const HEADER_RESERVED = 24;
const CONTENT_GAP = 10;

export const CARD_WIDTH = 180;
export const CARD_GAP = 7;

const LIST_HORIZONTAL_PADDING = 8;
const LIST_VERTICAL_PADDING = 12;
const LIST_BORDER = 1;
const TITLE_HORIZONTAL_PADDING = 12;
const TITLE_VERTICAL_PADDING = 8;
const TITLE_GAP = 4;
const BADGE_HORIZONTAL_PADDING = 8;
const BADGE_VERTICAL_PADDING = 4;
const BLOCK_GAP = 6;
export const DIVIDER_HEIGHT = 1;
const OVERSEER_GAP = 5;
const MEMBER_GAP = 4;
const LINE_RATIO = 1.1;
const AVERAGE_CHAR_RATIO = 0.55;

const lineHeight = (fontSize: number) => fontSize * LINE_RATIO;

const nameLines = (name: string, fontSize: number, width: number) =>
  Math.max(1, Math.ceil((name.length * AVERAGE_CHAR_RATIO * fontSize) / width));

const textHeight = (
  names: string[],
  fontSize: number,
  width: number,
  gap: number
) => {
  if (names.length === 0) return 0;

  const lines = names.reduce(
    (total, name) =>
      total + nameLines(name, fontSize, width) * lineHeight(fontSize),
    0
  );

  return lines + (names.length - 1) * gap;
};

export const cardWidth = (span: number) =>
  span * CARD_WIDTH + (span - 1) * CARD_GAP;

export const contentWidth = (span: number) =>
  cardWidth(span) - 2 * LIST_HORIZONTAL_PADDING - LIST_BORDER;

export const columnWidth = (span: number) =>
  (contentWidth(span) - (span - 1) * CARD_GAP) / span;

const titleWidth = (span: number, fontSize: number, membersCount: number) =>
  cardWidth(span) -
  TITLE_HORIZONTAL_PADDING -
  TITLE_GAP -
  BADGE_HORIZONTAL_PADDING -
  String(membersCount).length * AVERAGE_CHAR_RATIO * (fontSize - 2);

const overseersOf = (group: FieldServiceGroupExportType) =>
  [group.overseer, group.overseerAssistant].filter(
    (name): name is string => !!name
  );

const chromeHeight = (
  group: FieldServiceGroupExportType,
  fontSize: number,
  span: number,
  membersCount: number
) => {
  const titleLines = nameLines(
    group.group_name,
    fontSize,
    titleWidth(span, fontSize, membersCount)
  );

  const titleHeight =
    Math.max(
      titleLines * lineHeight(fontSize),
      lineHeight(fontSize - 2) + BADGE_VERTICAL_PADDING
    ) + TITLE_VERTICAL_PADDING;

  const overseers = overseersOf(group);

  const overseerHeight = overseers.length
    ? textHeight(overseers, fontSize, contentWidth(span), OVERSEER_GAP) +
      2 * BLOCK_GAP +
      DIVIDER_HEIGHT
    : 0;

  return titleHeight + LIST_VERTICAL_PADDING + LIST_BORDER + overseerHeight;
};

export const pageBox = (orientation: FSGPageOrientation) => {
  const width = orientation === 'landscape' ? A4_HEIGHT : A4_WIDTH;
  const height = orientation === 'landscape' ? A4_WIDTH : A4_HEIGHT;

  return {
    width: width - 2 * PAGE_PADDING,
    height: height - 2 * PAGE_PADDING - HEADER_RESERVED - CONTENT_GAP,
  };
};

export const columnCount = (orientation: FSGPageOrientation) =>
  Math.max(
    1,
    Math.floor(
      (pageBox(orientation).width + CARD_GAP) / (CARD_WIDTH + CARD_GAP)
    )
  );

const balanceColumns = (
  publishers: string[],
  span: number,
  fontSize: number,
  width: number
) => {
  const target = textHeight(publishers, fontSize, width, MEMBER_GAP) / span;
  const columns: string[][] = Array.from({ length: span }, () => []);

  let index = 0;
  let filled = 0;

  for (const publisher of publishers) {
    const height =
      nameLines(publisher, fontSize, width) * lineHeight(fontSize) + MEMBER_GAP;

    if (index < span - 1 && filled > 0 && filled + height / 2 > target) {
      index += 1;
      filled = 0;
    }

    columns[index].push(publisher);
    filled += height;
  }

  return columns;
};

const membersCountOf = (group: FieldServiceGroupExportType) =>
  group.publishers.length + overseersOf(group).length;

const layoutCard = (
  input: {
    id: string;
    group: FieldServiceGroupExportType;
    membersCount: number;
  },
  fontSize: number,
  maxHeight: number,
  maxSpan: number
): FSGCard => {
  const { id, group, membersCount } = input;

  const measure = (span: number): FSGCard => {
    const width = columnWidth(span);
    const publishers = balanceColumns(group.publishers, span, fontSize, width);

    const height =
      chromeHeight(group, fontSize, span, membersCount) +
      Math.max(
        0,
        ...publishers.map((column) =>
          textHeight(column, fontSize, width, MEMBER_GAP)
        )
      );

    const columns = publishers.map((column, position) => ({
      id: `${id}-${position}`,
      publishers: column,
    }));

    return { id, group, span, columns, height, membersCount };
  };

  let card = measure(1);

  for (let span = 2; span <= maxSpan && card.height > maxHeight; span++) {
    card = measure(span);
  }

  return card;
};

const layoutCards = (
  group: FieldServiceGroupExportType,
  fontSize: number,
  maxHeight: number,
  maxSpan: number
): FSGCard[] => {
  const membersCount = membersCountOf(group);

  const whole = layoutCard(
    { id: `${group.group_number}`, group, membersCount },
    fontSize,
    maxHeight,
    maxSpan
  );

  if (whole.height <= maxHeight) return [whole];

  const cards: FSGCard[] = [];

  let remaining = group.publishers;
  let leading = true;

  while (remaining.length > 0) {
    const measure = (take: number) =>
      layoutCard(
        {
          id: `${group.group_number}-${cards.length}`,
          membersCount,
          group: {
            ...group,
            publishers: remaining.slice(0, take),
            overseer: leading ? group.overseer : undefined,
            overseerAssistant: leading ? group.overseerAssistant : undefined,
          },
        },
        fontSize,
        maxHeight,
        maxSpan
      );

    let take = remaining.length;
    let card = measure(take);

    while (take > 1 && card.height > maxHeight) {
      take = Math.max(1, Math.floor((take * maxHeight) / card.height));
      card = measure(take);
    }

    while (take < remaining.length) {
      const wider = measure(take + 1);

      if (wider.height > maxHeight) break;

      take += 1;
      card = wider;
    }

    cards.push(card);

    remaining = remaining.slice(take);
    leading = false;
  }

  return cards;
};

const packGroups = (
  groups: FieldServiceGroupExportType[],
  fontSize: number,
  orientation: FSGPageOrientation
) => {
  const { height: maxHeight } = pageBox(orientation);
  const columns = columnCount(orientation);

  const pages: FSGPlacement[][] = [];

  let placements: FSGPlacement[] = [];
  let filled: number[] = Array.from({ length: columns }, () => 0);

  const nextPage = () => {
    if (placements.length > 0) pages.push(placements);

    placements = [];
    filled = Array.from({ length: columns }, () => 0);
  };

  const cards = groups.flatMap((group) =>
    layoutCards(group, fontSize, maxHeight, columns)
  );

  for (const card of cards) {
    let column = -1;
    let top = Infinity;

    for (let index = 0; index + card.span <= columns; index++) {
      const used = Math.max(...filled.slice(index, index + card.span));
      const offset = used === 0 ? 0 : used + CARD_GAP;

      if (offset + card.height <= maxHeight && offset < top) {
        column = index;
        top = offset;
      }
    }

    if (column === -1) {
      nextPage();
      column = 0;
      top = 0;
    }

    placements.push({
      card,
      left: column * (CARD_WIDTH + CARD_GAP),
      top,
    });

    for (let index = column; index < column + card.span; index++) {
      filled[index] = top + card.height;
    }
  }

  nextPage();

  return pages;
};

export default packGroups;
