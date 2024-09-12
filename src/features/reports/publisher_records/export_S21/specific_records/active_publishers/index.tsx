import { Stack } from '@mui/material';
import { useAppTranslation } from '@hooks/index';
import { ActivePublishersProps } from './index.types';
import useActivePublishers from './useActivePublishers';
import Button from '@components/button';
import SearchBar from '@components/search_bar';
import RichTreeViewCheckboxes from '@components/rich_tree_view/checkboxes';

const ActivePublishers = ({ onClose }: ActivePublishersProps) => {
  const { t } = useAppTranslation();

  const {
    groups,
    handleSelectionChange,
    selected,
    apiRef,
    handleItemSelectionToggle,
  } = useActivePublishers();

  return (
    <Stack spacing="24px" marginBottom="-24px">
      <Stack spacing="16px">
        <SearchBar placeholder={t('tr_searchByName')} />

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
        <Button variant="main">{t('tr_export')}</Button>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Stack>
    </Stack>
  );
};

export default ActivePublishers;
