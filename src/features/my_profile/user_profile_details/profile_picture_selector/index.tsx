import { Box } from '@mui/material';
import Dialog from '@components/dialog';
import DialogActions from '@components/dialog_actions';
import Typography from '@components/typography';
import Button from '@components/button';
import IconButton from '@components/icon_button';
import ProfilePicture from '@components/profile_picture';
import Tabs from '@components/tabs';
import { IconCheck } from '@icons/index';
import useProfilePictureSelector from './useProfilePictureSelector';

type Props = { open: boolean; onClose: () => void };

const ProfilePictureSelector = ({ open, onClose }: Props) => {
  const {
    t,
    sections,
    selectedType,
    setSelectedType,
    isProcessing,
    saveError,
    activeTab,
    setActiveTab,
    optionRefs,
    handleDone,
    handleClose,
    getName,
    handleOptionKeyDown,
  } = useProfilePictureSelector(onClose);

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      title={t('tr_changeProfilePicture')}
      actions={
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {saveError && (
            <Typography
              role="alert"
              className="body-small-regular"
              color="var(--red-main)"
            >
              {t('error_app_generic-title')}
            </Typography>
          )}
          <DialogActions>
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={isProcessing}
            >
              {t('tr_cancel')}
            </Button>
            <Button variant="main" onClick={handleDone} disabled={isProcessing}>
              {t(isProcessing ? 'tr_savingPicture' : 'tr_save')}
            </Button>
          </DialogActions>
        </Box>
      }
    >
      <Box
        sx={{
          width: '100%',
          minWidth: 0,
          '& .MuiTabs-scroller': {
            overflowX: 'auto !important',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
          },
        }}
      >
        <Tabs
          appearance="plain"
          value={activeTab}
          onChange={setActiveTab}
          tabs={sections.map(({ titleKey, options }) => ({
            label: t(titleKey),
            Component: (
              <Box
                role="radiogroup"
                aria-label={t(titleKey)}
                aria-busy={isProcessing}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, 64px)',
                  justifyContent: 'space-between',
                  gap: '16px',
                  padding: '8px',
                }}
              >
                {options.map((option, index) => {
                  const isSelected = selectedType === option;
                  const isTabStop =
                    isSelected ||
                    (!options.includes(selectedType) && index === 0);
                  return (
                    <IconButton
                      key={option}
                      role="radio"
                      aria-checked={isSelected}
                      tabIndex={isTabStop ? 0 : -1}
                      disabled={isProcessing}
                      aria-label={getName(option, titleKey, index)}
                      title={getName(option, titleKey, index)}
                      ref={(element) => {
                        if (element) optionRefs.current.set(option, element);
                        else optionRefs.current.delete(option);
                      }}
                      onClick={() => setSelectedType(option)}
                      onKeyDown={(event) =>
                        handleOptionKeyDown(event, options, index)
                      }
                      sx={{
                        position: 'relative',
                        margin: 0,
                        padding: 0,
                        borderRadius: 'var(--radius-max)',
                        outline: isSelected
                          ? '2px solid var(--accent-main)'
                          : '2px solid transparent',
                        outlineOffset: '4px',
                        transition:
                          'outline-color var(--motion-fast) var(--ease-standard), transform var(--motion-fast) var(--ease-standard)',
                        '&:hover': {
                          outlineColor: 'var(--accent-main)',
                          transform: 'scale(1.04)',
                        },
                        '&:active': { transform: 'scale(0.98)' },
                        '@media (prefers-reduced-motion: reduce)': {
                          transition: 'none',
                          '&:hover, &:active': { transform: 'none' },
                        },
                        '&:focus-visible': {
                          outline: '2px solid var(--accent-main)',
                          outlineOffset: '4px',
                        },
                      }}
                    >
                      <ProfilePicture size={64} type={option} alt="" />
                      {isSelected && (
                        <Box
                          component="span"
                          aria-hidden
                          sx={{
                            position: 'absolute',
                            bottom: '-4px',
                            insetInlineEnd: '-8px',
                            borderRadius: 'var(--radius-max)',
                            backgroundColor: 'var(--accent-main)',
                            border: '2px solid var(--white)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                          }}
                        >
                          <IconCheck
                            color="var(--always-white)"
                            width={20}
                            height={20}
                          />
                        </Box>
                      )}
                    </IconButton>
                  );
                })}
              </Box>
            ),
          }))}
        />
      </Box>
    </Dialog>
  );
};

export default ProfilePictureSelector;
