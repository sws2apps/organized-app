import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

const CongregationPersonPocketSetup = ({ member, handleDeleteOCode, handleGenerateOCode }) => {
  const { t } = useTranslation('ui');

  return (
    <Box sx={{ marginTop: '20px' }}>
      <Typography sx={{ fontWeight: 'bold', marginBottom: '20px', borderBottom: '1px outset', paddingBottom: '5px' }}>
        {t('pocketSetupInstruction')}
      </Typography>

      {member.pocket_oCode !== '' && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Typography>{t('pocketSetupSite')}</Typography>
          <Typography>{t('pocketSetupCode')}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <TextField
              id="outlined-token"
              variant="outlined"
              autoComplete="off"
              value={member.pocket_oCode}
              sx={{ width: '250px', input: { textAlign: 'center' } }}
              InputProps={{
                readOnly: true,
              }}
            />
            <IconButton color="error" onClick={handleDeleteOCode}>
              <DeleteIcon sx={{ fontSize: '40px' }} />
            </IconButton>
          </Box>
        </Box>
      )}

      {member.pocket_oCode === '' && (
        <Button variant="contained" onClick={handleGenerateOCode}>
          {t('pocketAddDevice')}
        </Button>
      )}
    </Box>
  );
};

export default CongregationPersonPocketSetup;
