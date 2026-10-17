import { TerritoryMapMarker } from '@definition/territory';
import { chip } from './helpers';
import PinIcon from './pin_icon';

const MarkerChip = ({ item }: { item: TerritoryMapMarker }) => {
  const { background, label } = chip(item);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: item.kind === 'text' ? '3px 8px' : '2px 6px',
        borderRadius: 'var(--radius-s)',
        background,
        color: '#FFFFFF',
        font: `${item.kind === 'text' ? 600 : 500} ${
          item.kind === 'text' ? 13 : 11
        }px Inter, sans-serif`,
        whiteSpace: 'nowrap',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.25)',
        pointerEvents: 'none',
      }}
    >
      {item.kind === 'pin' && (
        <PinIcon type={item.pinType} color="#FFFFFF" size={12} />
      )}
      {label}
    </div>
  );
};

export default MarkerChip;
