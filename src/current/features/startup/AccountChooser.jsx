import { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Typography from '@mui/material/Typography';
import { accountTypeState, isAccountChooseState, visitorIDState } from '../../states/main';

const AccountChooser = () => {
  const { t } = useTranslation('ui');

  const setAccountType = useSetRecoilState(accountTypeState);
  const setIsAccountChoose = useSetRecoilState(isAccountChooseState);

  const visitorID = useRecoilValue(visitorIDState);

  const handleChangeAccountType = (value) => {
    setAccountType(value);
  };

  const handleConfirmOption = () => {
    setIsAccountChoose(false);
  };

  useEffect(() => {
    setAccountType('pocket');
  }, [setAccountType]);

  return (
    <Container>
      <Typography variant="h4" sx={{ marginBottom: '15px' }}>
        {t('welcomeTitle')}
      </Typography>
      <Box sx={{ marginBottom: '20px' }}>
        <FormControl>
          <FormLabel id="radio-buttons-group-account-type">{t('chooseAccount')}</FormLabel>
          <RadioGroup
            aria-labelledby="radio-buttons-group-account-type"
            defaultValue="pocket"
            name="radio-buttons-group"
            onChange={(e) => handleChangeAccountType(e.target.value)}
            sx={{ marginTop: '15px', gap: '10px' }}
          >
            <FormControlLabel value="pocket" control={<Radio />} label={t('choosePocketAccount')} />
            <FormControlLabel value="vip" control={<Radio />} label={t('chooseVipAccount')} />
          </RadioGroup>
        </FormControl>
      </Box>
      <Button variant="contained" disabled={visitorID.toString().length === 0} onClick={handleConfirmOption}>
        {t('next')}
      </Button>
    </Container>
  );
};

export default AccountChooser;
