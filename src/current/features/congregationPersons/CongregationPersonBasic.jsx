import { useTranslation } from 'react-i18next';
import { Markup } from 'interweave';
import Box from '@mui/material/Box';
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates';
import Typography from '@mui/material/Typography';
import { Persons } from '../../classes/Persons';

const CongregationPersonBasic = ({ person }) => {
  const { t } = useTranslation('ui');

  const currentPerson = Persons.get(person.user_local_uid);

  const isElder = currentPerson?.isElder();
  const isMS = currentPerson?.isMS();
  const isPublisher = currentPerson?.isPublisher();

  return (
    <Box>
      <Typography variant="h5" sx={{ minWidth: '300px', fontWeight: 'bold' }}>
        {person.username}
      </Typography>
      <Typography>{person.user_uid}</Typography>

      {(isElder || isMS || isPublisher) && (
        <Box sx={{ marginLeft: '-50px', marginTop: person.user_uid ? '20px' : '40px', display: 'flex', gap: '8px' }}>
          <TipsAndUpdatesIcon sx={{ fontSize: '40px', color: '#F1C40F' }} />
          <Typography sx={{ fontSize: '14px' }}>
            <Markup
              content={t(
                isElder
                  ? 'cpeElderAutoAssignedRole'
                  : isMS
                  ? 'cpeMSAutoAssignedRole'
                  : isPublisher
                  ? 'cpePublisherAutoAssignedRole'
                  : ''
              )}
            />
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default CongregationPersonBasic;
