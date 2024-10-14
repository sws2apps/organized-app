import { Box } from '@mui/material';
import Button from '@components/button';
import TextField from '@components/textfield';
import { useAppTranslation, useBreakpoints } from '@hooks/index';
import { IconAdd, IconDelete } from '@icons/index';
import { ContactItemType } from './index.types';

const ContactItem = ({
  contact,
  id,
  isLast,
  name,
  onAdd,
  onContactChange,
  onDelete,
  onNameChange,
  readOnly,
}: ContactItemType) => {
  const { t } = useAppTranslation();

  const { tabletDown } = useBreakpoints();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <Box
        sx={{
          display: 'flex',
          gap: '16px',
          flexWrap: tabletDown ? 'wrap' : 'nowrap',
          justifyContent: 'space-between',
          flexDirection: 'row',
          width: '100%',
        }}
      >
        <TextField
          label={t('tr_name')}
          value={name}
          onChange={(e) => onNameChange(id, e.target.value)}
          slotProps={{ input: { readOnly } }}
        />
        <TextField
          label={t('tr_contactInfo')}
          value={contact}
          onChange={(e) => onContactChange(id, e.target.value)}
          slotProps={{ input: { readOnly } }}
        />
      </Box>

      {!readOnly && (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              justifyContent: isLast ? 'space-between' : 'flex-end',
              flexDirection: tabletDown ? 'column-reverse' : 'row',
            }}
          >
            {isLast && (
              <Button
                variant="small"
                startIcon={<IconAdd />}
                sx={{ height: '32px', minHeight: '32px !important' }}
                onClick={onAdd}
              >
                {t('tr_add')}
              </Button>
            )}

            <Button
              variant="small"
              color="red"
              startIcon={<IconDelete />}
              sx={{ height: '32px', minHeight: '32px !important' }}
              onClick={() => onDelete(id)}
            >
              {t('tr_delete')}
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ContactItem;
