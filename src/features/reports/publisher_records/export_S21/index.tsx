import { ExportS21Props } from './index.types';
import useExportS21 from './useExportS21';

import Dialog from '@components/dialog';
import AllRecords from './all_records';
import SpecificRecords from './specific_records';

const ExportS21 = (props: ExportS21Props) => {
  const {
    allOpen,
    handleAction,
    handleChangeType,
    selectOpen,
    type,
    handleExportCards,
  } = useExportS21(props);

  return (
    <Dialog onClose={props.onClose} open={props.open} sx={{ padding: '24px' }}>
      {allOpen && (
        <AllRecords
          type={type}
          onTypeChange={handleChangeType}
          action={handleAction}
          onClose={props.onClose}
        />
      )}

      {selectOpen && (
        <SpecificRecords onClose={props.onClose} onExport={handleExportCards} />
      )}
    </Dialog>
  );
};

export default ExportS21;
