import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { isAboutOpenState } from '../../states/main';

const currentYear = new Date().getFullYear();

const About = () => {
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useRecoilState(isAboutOpenState);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} sx={{ maxWidth: '600px', margin: 'auto' }}>
      <DialogContent sx={{ padding: '10px' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img src="/img/appLogo.png" alt="App logo" className="appLogoMini" />
          <Typography
            sx={{
              fontWeight: 'bold',
              marginTop: '5px',
            }}
          >
            Congregation Program for Everyone
          </Typography>
          <Typography variant="body1">{import.meta.env.PACKAGE_VERSION}</Typography>
        </Box>
        <Box>
          <Typography
            sx={{
              marginTop: '10px',
              marginBottom: '15px',
            }}
          >
            {t('about.description')}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              border: '1px solid black',
              width: '95%',
              margin: 'auto',
              padding: '5px',
              borderRadius: '8px',
              backgroundColor: '#bbdefb',
            }}
          >
            <Link href="https://github.com/sws2apps/lmm-oa-sws" target="_blank" rel="noopener">
              <svg height="32" viewBox="0 0 16 16" width="32">
                <path
                  fillRule="evenodd"
                  d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                ></path>
              </svg>
            </Link>
            <Typography
              variant="body2"
              sx={{
                marginLeft: '10px',
                color: 'black',
              }}
            >
              Check this project on GitHub if you want to help us improve it.
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ marginTop: '15px' }}>
            Copyright © {currentYear} | CPE [sws2apps]
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default About;
