import { View } from '@react-pdf/renderer';
import { RowPageProbeProps } from './index.types';

const RowPageProbe = ({ id, onRowPage }: RowPageProbeProps) => {
  if (!onRowPage) return null;

  return (
    <View
      style={{ position: 'absolute' }}
      render={({ pageNumber }) => {
        onRowPage(id, pageNumber);
        return null;
      }}
    />
  );
};

export default RowPageProbe;
