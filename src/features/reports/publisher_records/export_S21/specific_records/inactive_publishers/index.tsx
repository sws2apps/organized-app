import { Stack } from '@mui/material';
import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import { InactivePublishersProps } from './index.types';
import useActivePublishers from './useInactivePublishers';
import Button from '@components/button';
import SearchBar from '@components/search_bar';
import RichTreeViewCheckboxes from '@components/rich_tree_view/checkboxes';

const InactivePublishers = (props: InactivePublishersProps) => {
  const { t } = useAppTranslation();

  const {
    groups,
    handleSelectionChange,
    selected,
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
          items={groups}
          expandedItems={['inactive_all']}
          selectedItems={selected}
          onSelectedItemsChange={(_, values) => handleSelectionChange(values)}
          sx={{
            '& .MuiTreeItem-iconContainer': { display: 'none' },
          }}
        />
      </Stack>

      <Stack spacing="8px" width="100%">
        <Button
          variant="main"
          disabled={isProcessing}
          onClick={handleExport}
          endIcon={isProcessing && <IconLoading color="var(--white)" />}
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
