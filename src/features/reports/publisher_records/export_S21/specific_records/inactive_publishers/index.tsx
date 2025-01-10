import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { InactivePublishersProps } from './index.types';
import useActivePublishers from './useInactivePublishers';
import Button from '@components/button';
import SearchBar from '@components/search_bar';
import RichTreeViewCheckboxes from '@components/rich_tree_view/checkboxes';
import WaitingLoader from '@components/waiting_loader';

const InactivePublishers = (props: InactivePublishersProps) => {
  const { t } = useAppTranslation();

  const {
    groups,
    handleSelectionChange,
    selected,
    apiRef,
    handleItemSelectionToggle,
    btnLabel,
    handleSearchChange,
    search,
    handleExport,
    isProcessing,
  } = useActivePublishers(props);

  return (
    <Stack spacing="24px" marginBottom="-24px">
      <Stack spacing="16px">
        <SearchBar
          placeholder={t('tr_searchByName')}
          value={search}
          onSearch={handleSearchChange}
        />

        <RichTreeViewCheckboxes
          apiRef={apiRef}
          items={groups}
          expandedItems={['inactive_all']}
          selectedItems={selected}
          onSelectedItemsChange={(_, values) => handleSelectionChange(values)}
          onItemSelectionToggle={(_, id, checked) =>
            handleItemSelectionToggle(id, checked)
          }
          slotProps={{
            item: {
              sx: { '.MuiTreeItem-iconContainer': { display: 'none' } },
            },
          }}
        />
      </Stack>

      <Stack spacing="8px" width="100%">
        <Button
          variant="main"
          disabled={isProcessing}
          onClick={handleExport}
          endIcon={
            isProcessing && <WaitingLoader size={22} variant="standard" />
          }
        >
          {btnLabel}
        </Button>
        <Button
          variant="secondary"
          disabled={isProcessing}
          onClick={props.onClose}
        >
          {t('tr_cancel')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default InactivePublishers;
