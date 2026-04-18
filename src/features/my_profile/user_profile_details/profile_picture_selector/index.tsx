import { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useAtomValue } from 'jotai';
import { userAvatarTypeState, userAvatarUrlState } from '@states/settings';
import { AvatarType } from '@definition/settings';
import { useAppTranslation } from '@hooks/index';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import Dialog from '@components/dialog';
import Typography from '@components/typography';
import Button from '@components/button';
import ProfilePicture from '@components/profile_picture';
import { IconCheckmarkCircleAlt } from '@icons/index';

type ProfilePictureSelectorProps = {
  open: boolean;
  onClose: () => void;
};

const SECTIONS: { titleKey: string; options: AvatarType[] }[] = [
  {
    titleKey: 'tr_basic',
    options: ['default', 'initials', 'google'],
  },
  {
    titleKey: 'tr_gradient',
    options: [
      'GradientPurple',
      'GradientPink',
      'GradientOrange',
      'GradientLime',
      'GradientBlue',
      'GradientGreen',
    ],
  },
  {
    titleKey: 'tr_abstractShape',
    options: [
      'Abstract1',
      'Abstract2',
      'Abstract3',
      'Abstract4',
      'Abstract5',
      'Abstract6',
      'Abstract7',
      'Abstract8',
      'Abstract9',
      'Abstract10',
    ],
  },
  {
    titleKey: 'tr_bibleStory',
    options: [
      'StoryFigs',
      'StoryLeaves',
      'StoryLion',
      'StoryPearl',
      'StoryWatchtower',
    ],
  },
];

const ProfilePictureSelector = ({
  open,
  onClose,
}: ProfilePictureSelectorProps) => {
  const { t } = useAppTranslation();

  const globalAvatarType = useAtomValue(userAvatarTypeState);
  const avatarUrl = useAtomValue(userAvatarUrlState);

  const [localAvatarType, setLocalAvatarType] =
    useState<AvatarType>(globalAvatarType);

  // Compute the flat set of all options that can currently be shown.
  // If the persisted type is 'google' but no avatarUrl exists (e.g. OAuth photo unavailable),
  // fall back to 'default' so the dialog never silently re-saves an invisible selection.
  const allAvailableOptions = SECTIONS.flatMap((s) =>
    s.options.filter((opt) => opt !== 'google' || !!avatarUrl)
  );

  useEffect(() => {
    if (open) {
      // Snapshot the global value when the dialog opens so the user can
      // freely browse and cancel without affecting the committed selection.
      // Intentionally omitting globalAvatarType from deps — we only want
      // to reset on open, not react to external updates while browsing.
      const safeType = allAvailableOptions.includes(globalAvatarType)
        ? globalAvatarType
        : 'default';
      setLocalAvatarType(safeType);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = (opt: AvatarType) => {
    setLocalAvatarType(opt);
  };

  const handleDone = async () => {
    await dbAppSettingsUpdate({
      'user_settings.user_avatar_type': {
        value: localAvatarType,
        updatedAt: new Date().toISOString(),
      },
    });
    onClose();
  };

  return (
    <Dialog onClose={onClose} open={open} sx={{ padding: '0px' }}>
      <Box
        sx={{
          padding: '24px 24px 8px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <Typography className="h2">{t('tr_profilePicture')}</Typography>
        <Typography className="body-regular" color="var(--grey-400)">
          {t('tr_profilePictureDesc')}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          padding: '16px 24px',
          maxHeight: '60vh',
          overflowY: 'auto',
        }}
      >
        {SECTIONS.map((section) => {
          const availableOptions = section.options.filter((opt) =>
            allAvailableOptions.includes(opt)
          );

          if (availableOptions.length === 0) return null;

          return (
            <Box
              key={section.titleKey}
              sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <Typography className="label-small-regular" color="var(--black)">
                {t(section.titleKey)}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {availableOptions.map((opt) => {
                  const isSelected = localAvatarType === opt;

                  return (
                    <Box
                      key={opt}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSelected}
                      aria-label={opt}
                      onClick={() => handleSelect(opt)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelect(opt);
                        }
                      }}
                      sx={{
                        position: 'relative',
                        cursor: 'pointer',
                        borderRadius: '50%',
                        margin: '2px',
                        outline: isSelected
                          ? '2px solid var(--accent-main)'
                          : '2px solid transparent',
                        outlineOffset: '2px',
                        '&:hover': {
                          opacity: 0.85,
                        },
                      }}
                    >
                      <ProfilePicture size={48} typeOverride={opt} alt={opt} />
                      {isSelected && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: -6,
                            right: -6,
                            borderRadius: '50%',
                            backgroundColor: 'var(--white)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '24px',
                            height: '24px',
                          }}
                        >
                          <IconCheckmarkCircleAlt
                            color="var(--accent-main)"
                            width={28}
                            height={28}
                          />
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          );
        })}
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '100%',
          padding: '16px 24px 24px 24px',
        }}
      >
        <Button variant="main" onClick={handleDone}>
          {t('tr_done')}
        </Button>
        <Button variant="secondary" onClick={onClose}>
          {t('tr_cancel')}
        </Button>
      </Box>
    </Dialog>
  );
};

export default ProfilePictureSelector;
