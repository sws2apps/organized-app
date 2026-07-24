import { Stack } from '@mui/material';
import { IconEdit } from '@components/icons';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { DUTIES_MAX } from '../../shared/constants';
import { TwoColumnsRow } from '@features/congregation/settings/shared_styles';
import { DutyItemProps } from './index.types';
import useDutyItem from './useDutyItem';
import Button from '@components/button';
import Dialog from '@components/dialog';
import DutyEdit from '../duty_edit';
import IconButton from '@components/icon_button';
import MenuItem from '@components/menuitem';
import Select from '@components/select';
import Typography from '@components/typography';

const DutyItem = (props: DutyItemProps) => {
  const { t } = useAppTranslation();

  const { laptopUp } = useBreakpoints();

  const {
    formOpen,
    handleCloseForm,
    handleOpenForm,
    deleteOpen,
    handleAskDelete,
    handleCloseDelete,
    handleDelete,
    handleHover,
    handleUnhover,
    showEdit,
    handleAmountChange,
  } = useDutyItem(props);

  return (
    <TwoColumnsRow
      sx={{
        flexDirection: laptopUp ? 'row' : 'column',
        alignItems: laptopUp ? 'center' : 'unset',
      }}
    >
      {formOpen && (
        <DutyEdit
          type="edit"
          id={props.id}
          open={formOpen}
          onClose={handleCloseForm}
          onDelete={handleAskDelete}
        />
      )}

      {deleteOpen && (
        <Dialog onClose={handleCloseDelete} open={deleteOpen}>
          <Stack spacing="24px" width="100%">
            <Typography className="h2">{t('tr_dutiesCustomDelete')}</Typography>
            <Typography color="var(--grey-400)">
              {t('tr_dutiesCustomDeleteDesc')}
            </Typography>
            <Stack spacing="8px">
              <Button variant="main" color="red" onClick={handleDelete}>
                {t('tr_delete')}
              </Button>
              <Button variant="secondary" onClick={handleCloseDelete}>
                {t('tr_cancel')}
              </Button>
            </Stack>
          </Stack>
        </Dialog>
      )}

      <Stack
        spacing="4px"
        direction="row"
        alignItems="center"
        onMouseEnter={handleHover}
        onMouseLeave={handleUnhover}
      >
        <Typography>{props.name}</Typography>

        {showEdit && (
          <IconButton sx={{ padding: 0 }} onClick={handleOpenForm}>
            <IconEdit height={20} width={20} color="var(--accent-main)" />
          </IconButton>
        )}
      </Stack>

      <Select
        label={t('tr_amountLabel')}
        value={props.amount}
        onChange={handleAmountChange}
      >
        <MenuItem value={0}>
          <Typography>{t('tr_disabledLabel')}</Typography>
        </MenuItem>

        {DUTIES_MAX.map((num) => (
          <MenuItem key={num} value={num}>
            <Typography>{num}</Typography>
          </MenuItem>
        ))}
      </Select>
    </TwoColumnsRow>
  );
};

export default DutyItem;
