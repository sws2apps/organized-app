import { Box } from '@mui/material';
import { IconAdd, IconInfo } from '@icons/index';
import { useAppTranslation, useCurrentUser } from '@hooks/index';
import useEmergencyContacts from './useEmergencyContacts';
import Button from '@components/button';
import Typography from '@components/typography';
import ContactItem from './contact_item';

const PersonEmergencyContacts = () => {
  const { t } = useAppTranslation();

  const { isPersonEditor } = useCurrentUser();

  const {
    handleAddContact,
    handleContactChange,
    handleDeleteContact,
    handleNameChange,
    activeContacts,
  } = useEmergencyContacts();

  return (
    <Box
      sx={{
        backgroundColor: 'var(--white)',
        border: '1px solid var(--accent-300)',
        display: 'flex',
        padding: '16px',
        gap: '16px',
        flexDirection: 'column',
        borderRadius: 'var(--radius-xl)',
      }}
    >
      <Typography className="h2">{t('tr_emergencyContacts')}</Typography>

      {activeContacts.length === 0 && (
        <Box sx={{ display: 'flex', gap: '16px', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconInfo color="var(--grey-350)" />
            <Typography color="var(--grey-350)">
              {t('tr_personEmergencyDesc')}
            </Typography>
          </Box>

          {isPersonEditor && (
            <Button
              variant="small"
              startIcon={<IconAdd />}
              onClick={handleAddContact}
              sx={{
                height: '32px',
                minHeight: '32px !important',
                alignSelf: 'flex-start',
              }}
            >
              {t('tr_add')}
            </Button>
          )}
        </Box>
      )}

      {activeContacts.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginTop: '8px',
          }}
        >
          {activeContacts.map((contactItem, index) => (
            <ContactItem
              key={contactItem.id}
              readOnly={!isPersonEditor}
              id={contactItem.id}
              name={contactItem.name}
              contact={contactItem.contact}
              isLast={index === activeContacts.length - 1}
              onAdd={handleAddContact}
              onDelete={handleDeleteContact}
              onNameChange={handleNameChange}
              onContactChange={handleContactChange}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default PersonEmergencyContacts;
