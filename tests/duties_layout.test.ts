import assert from 'node:assert/strict';
import { test } from 'node:test';
import packDuties, {
  cardWidth,
  pageBox,
} from '@views/meetings/duties/packDuties';
import { DutiesScheduleCardType } from '@views/meetings/duties/index.types';

const cards: DutiesScheduleCardType[] = Array.from(
  { length: 8 },
  (_, duty) => ({
    id: `duty-${duty}`,
    name: `Meeting duty ${duty}`,
    icon: 'custom',
    rows: Array.from({ length: 40 }, (_, row) => ({
      id: `duty-${duty}-week-${row}`,
      date: `${row + 1} Sep`,
      persons: [
        {
          id: `publisher-${row}`,
          name: `Publisher with a long printed name ${row}`,
          note:
            row % 3 ? undefined : 'Microphone section: first and second parts',
          groupId: String(row % 2),
        },
      ],
    })),
  })
);

for (const orientation of ['portrait', 'landscape'] as const) {
  test(`${orientation}: dense duties keep every week exactly once`, () => {
    const pages = packDuties(cards, 11, orientation);
    assert.ok(pages.length > 1);
    const actual = pages.flatMap((page) =>
      page.flatMap(({ card }) => card.columns.flat().map((row) => row.id))
    );
    const expected = cards.flatMap((card) => card.rows.map((row) => row.id));
    assert.deepEqual(actual.sort(), expected.sort());
    assert.equal(new Set(actual).size, expected.length);
  });

  test(`${orientation}: cards stay within the page and never overlap`, () => {
    const box = pageBox(orientation);
    for (const page of packDuties(cards, 11, orientation)) {
      for (const [index, placement] of page.entries()) {
        const width = cardWidth(orientation, placement.card.span);
        assert.ok(placement.left >= 0 && placement.top >= 0);
        assert.ok(placement.left + width <= box.width + 0.01);
        assert.ok(placement.top + placement.card.height <= box.height + 0.01);
        for (const previous of page.slice(0, index)) {
          const previousWidth = cardWidth(orientation, previous.card.span);
          const separated =
            placement.left + width <= previous.left ||
            previous.left + previousWidth <= placement.left ||
            placement.top + placement.card.height <= previous.top ||
            previous.top + previous.card.height <= placement.top;
          assert.ok(separated, 'printed cards overlap');
        }
      }
    }
  });
}
