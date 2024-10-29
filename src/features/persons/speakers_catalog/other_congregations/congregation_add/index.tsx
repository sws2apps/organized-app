import { Box } from '@mui/material';
import { CongregationAddType } from './index.types';
import { useAppTranslation } from '@hooks/index';
import useCongregationAdd from './useCongregationAdd';
import Button from '@components/button';
import CongregationDetails from './details';
import CongregationOfflineAdd from './offline';
import CongregationOnlineAdd from './online';
import Dialog from '@components/dialog';
import Tabs from '@components/tabs';
import Typography from '@components/typography';

const CongregationAdd = ({ onClose, open }: CongregationAddType) => {
  const { t } = useAppTranslation();

  const {
    handleSelectCongregation,
    congregation,
    handleResetCongregation,
    isFindCongregation,
    handleMoveNext,
    handleMovePrevious,
    handleCongAddressChange,
    handleMidweekWeekdayChange,
    handleMidweekTimeChange,
    handleWeekendTimeChange,
    handleWeekendWeekdayChange,
    handleCoordinatorEmailChange,
    handleCoordinatorNameChange,
    handleCoordinatorPhoneChange,
    handleTalkCoordinatorEmailChange,
    handleTalkCoordinatorNameChange,
    handleTalkCoordinatorPhoneChange,
    handleIncomingCongregationAdd,
    congAccountConnected,
  } = useCongregationAdd(onClose);

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '24px' }}>
      {isFindCongregation && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Typography className="h2">{t('tr_addCongregation')}</Typography>

          <Box sx={{ width: '100%', marginBottom: '-24px', marginTop: '-8px' }}>
            <Tabs
              onChange={() => handleResetCongregation()}
              tabs={
                congAccountConnected
                  ? [
                      {
                        label: t('tr_congregationInOrganized'),
                        Component: (
                          <CongregationOnlineAdd
                            onCongregationChange={handleSelectCongregation}
                          />
                        ),
                      },
                      {
                        label: t('tr_addManually'),
                        Component: (
                          <CongregationOfflineAdd
                            onCongregationChange={handleSelectCongregation}
                          />
                        ),
                      },
                    ]
                  : [
                      {
                        label: t('tr_addManually'),
                        Component: (
                          <CongregationOfflineAdd
                            onCongregationChange={handleSelectCongregation}
                          />
                        ),
                      },
                    ]
              }
            />
          </Box>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              width: '100%',
            }}
          >
            <Button
              variant="main"
              disabled={congregation === null}
              onClick={handleMoveNext}
            >
              {t('tr_continue')}
            </Button>
            <Button variant="secondary" onClick={onClose}>
              {t('tr_cancel')}
            </Button>
          </Box>
        </Box>
      )}

      {!isFindCongregation && (
        <CongregationDetails
          congregation={congregation}
          handleCongAddressChange={handleCongAddressChange}
          handleCoordinatorEmailChange={handleCoordinatorEmailChange}
          handleCoordinatorNameChange={handleCoordinatorNameChange}
          handleCoordinatorPhoneChange={handleCoordinatorPhoneChange}
          handleIncomingCongregationAdd={handleIncomingCongregationAdd}
          handleMidweekTimeChange={handleMidweekTimeChange}
          handleMidweekWeekdayChange={handleMidweekWeekdayChange}
          handleMovePrevious={handleMovePrevious}
          handleTalkCoordinatorEmailChange={handleTalkCoordinatorEmailChange}
          handleTalkCoordinatorNameChange={handleTalkCoordinatorNameChange}
          handleTalkCoordinatorPhoneChange={handleTalkCoordinatorPhoneChange}
          handleWeekendTimeChange={handleWeekendTimeChange}
          handleWeekendWeekdayChange={handleWeekendWeekdayChange}
        />
      )}
    </Dialog>
  );
};

export default CongregationAdd;
