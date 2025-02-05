import { Stack } from '@mui/material';
import IconLoading from '@components/icon_loading';
import { useAppTranslation } from '@hooks/index';
import { FieldServiceGroupsProps } from './index.types';
import useFieldServiceGroups from './useFieldServiceGroups';
import Button from '@components/button';
import RichTreeViewCheckboxes from '@components/rich_tree_view/checkboxes';
import SearchBar from '@components/search_bar';

const FieldServiceGroups = (props: FieldServiceGroupsProps) => {
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
  } = useFieldServiceGroups(props);

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
          selectedItems={selected}
          onSelectedItemsChange={(_, values) => handleSelectionChange(values)}
          onItemSelectionToggle={(_, id, checked) =>
            handleItemSelectionToggle(id, checked)
          }
        />
      </Stack>

      <Stack spacing="8px" width="100%">
        <Button
          variant="main"
          disabled={isProcessing}
          onClick={handleExport}
          endIcon={isProcessing && <IconLoading />}
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

export default FieldServiceGroups;
