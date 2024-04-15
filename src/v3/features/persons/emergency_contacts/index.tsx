import { Box } from '@mui/material';
import { IconAdd } from '@icons/index';
import Button from '@components/button';
import Typography from '@components/typography';
import { useAppTranslation } from '@hooks/index';
import useEmergencyContacts from './useEmergencyContacts';
import ContactItem from './components/contact_item';

const PersonEmergencyContacts = () => {
  const { t } = useAppTranslation();

  const { handleAddContact, handleContactChange, handleDeleteContact, handleNameChange, activeContacts } =
    useEmergencyContacts();

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
        <Button
          variant="small"
          startIcon={<IconAdd />}
          onClick={handleAddContact}
          sx={{ height: '32px', minHeight: '32px !important', alignSelf: 'flex-start' }}
        >
          {t('tr_add')}
        </Button>
      )}

      {activeContacts.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
          {activeContacts.map((contactItem, index) => (
            <ContactItem
              key={contactItem.id}
              id={contactItem.id}
              name={contactItem.name.value}
              contact={contactItem.contact.value}
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
