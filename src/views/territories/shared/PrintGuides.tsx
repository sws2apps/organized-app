import { Line, Svg } from '@react-pdf/renderer';

// crop marks sit in the page margin, so nothing is left on a card once it is cut
const GAP = 2;
const MARK = 7;
const ROOM = GAP + MARK;

// Draw last. Corner marks frame the whole sheet; a shared edge between two cards
// gets a mark on each side of it.
const PrintGuides = ({
  width,
  height,
  horizontal,
}: {
  width: number;
  height: number;
  horizontal?: number;
}) => {
  const right = width + ROOM;
  const bottom = height + ROOM;

  const lines: [number, number, number, number][] = [
    // top left, top right, bottom left, bottom right: one across, one down each
    [0, ROOM, MARK, ROOM],
    [ROOM, 0, ROOM, MARK],
    [right + GAP, ROOM, right + ROOM, ROOM],
    [right, 0, right, MARK],
    [0, bottom, MARK, bottom],
    [ROOM, bottom + GAP, ROOM, bottom + ROOM],
    [right + GAP, bottom, right + ROOM, bottom],
    [right, bottom + GAP, right, bottom + ROOM],
  ];

  if (horizontal !== undefined) {
    const y = horizontal + ROOM;
    lines.push([0, y, MARK, y], [right + GAP, y, right + ROOM, y]);
  }

  return (
    <Svg
      width={width + ROOM * 2}
      height={height + ROOM * 2}
      style={{ position: 'absolute', top: -ROOM, left: -ROOM }}
    >
      {lines.map(([x1, y1, x2, y2]) => (
        <Line
          key={`${x1}:${y1}:${x2}:${y2}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="#555555"
          strokeWidth={0.5}
        />
      ))}
    </Svg>
  );
};
export default PrintGuides;
