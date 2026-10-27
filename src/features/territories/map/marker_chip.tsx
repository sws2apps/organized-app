import { TerritoryMapMarker } from '@definition/territory';
import { chip, isAreaLetter } from '@features/territories/map/helpers';
import PinIcon from '@features/territories/map/pin_icon';

// the classes let the map hide labels and notes by zoom (markers.ts)
const MarkerChip = ({
  item,
  selected = false,
}: {
  item: TerritoryMapMarker;
  selected?: boolean;
}) => {
  const { background, label } = chip(item);

  return (
    <div
      className={`territory-marker territory-marker--${item.kind}${
        isAreaLetter(item) ? ' territory-marker--area' : ''
      }`}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: item.kind === 'text' ? '2px 6px' : '2px 5px',
        borderRadius: 'var(--radius-s)',
        background,
        color: '#FFFFFF',
        font: `${item.kind === 'text' ? 600 : 500} 11px Inter, sans-serif`,
        whiteSpace: 'nowrap',
        boxShadow: selected
          ? '0 0 0 2px #FFFFFF, 0 0 0 4px var(--accent-main), 0 2px 8px rgba(0, 0, 0, 0.35)'
          : '0 1px 3px rgba(0, 0, 0, 0.25)',
        transform: selected ? 'scale(1.12)' : undefined,
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        pointerEvents: 'none',
      }}
    >
      {item.kind === 'pin' && (
        <PinIcon type={item.pinType} color="#FFFFFF" size={12} />
      )}
      <span className="territory-marker-label">{label}</span>
    </div>
  );
};

export default MarkerChip;
