import { useState, useMemo, useEffect } from 'react';
import { Box } from '@mui/material';
import { useAtomValue } from 'jotai';
import { userAvatarTypeState, userAvatarUrlState } from '@states/settings';
import { AvatarType } from '@definition/settings';
import { useAppTranslation } from '@hooks/index';
import useCurrentUser from '@hooks/useCurrentUser';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import Dialog from '@components/dialog';
import Typography from '@components/typography';
import Button from '@components/button';
import ProfilePicture from '@components/profile_picture';
import { IconCheck } from '@icons/index';

type ProfilePictureSelectorProps = {
  open: boolean;
  onClose: () => void;
};

type OptionDef = {
  type: AvatarType;
  gender?: 'male' | 'female';
};

type SectionDef = {
  titleKey: string;
  options: OptionDef[];
};

const SECTIONS: SectionDef[] = [
  {
    titleKey: 'tr_basic',
    options: [
      { type: 'default' },
      { type: 'initials' },
      { type: 'google' },
      { type: 'MaleIcon1', gender: 'male' },
      { type: 'MaleIcon2', gender: 'male' },
      { type: 'MaleIcon3', gender: 'male' },
      { type: 'FemaleIcon1', gender: 'female' },
      { type: 'FemaleIcon2', gender: 'female' },
      { type: 'FemaleIcon3', gender: 'female' },
    ],
  },
  {
    titleKey: 'tr_gradient',
    options: [
      { type: 'GradientOrange' },
      { type: 'GradientBrown' },
      { type: 'GradientLime' },
      { type: 'GradientGreen' },
      { type: 'GradientBlue' },
      { type: 'GradientPurple' },
      { type: 'GradientPink' },
    ],
  },
  {
    titleKey: 'tr_person',
    options: [
      { type: 'Male1', gender: 'male' },
      { type: 'Male2', gender: 'male' },
      { type: 'Male3', gender: 'male' },
      { type: 'Male4', gender: 'male' },
    ],
  },
  {
    titleKey: 'tr_abstractShape',
    options: [
      { type: 'Abstract1' },
      { type: 'Abstract2' },
      { type: 'Abstract3' },
      { type: 'Abstract4' },
      { type: 'Abstract5' },
      { type: 'Abstract6' },
      { type: 'Abstract7' },
      { type: 'Abstract8' },
      { type: 'Abstract9' },
      { type: 'Abstract10' },
    ],
  },
  {
    titleKey: 'tr_bibleStory',
    options: [
      { type: 'StoryDesert' },
      { type: 'StoryField' },
      { type: 'StoryFigs' },
      { type: 'StoryLamp' },
      { type: 'StoryLeaves' },
      { type: 'StoryLion' },
      { type: 'StoryLionScripture' },
      { type: 'StoryPearl' },
      { type: 'StoryRod' },
      { type: 'StorySeeds' },
      { type: 'StorySheep' },
      { type: 'StoryWatchtower' },
    ],
  },
];

const ProfilePictureSelector = ({
  open,
  onClose,
}: ProfilePictureSelectorProps) => {
  const { t } = useAppTranslation();
  const { person, isAdmin } = useCurrentUser();

  const globalAvatarType = useAtomValue(userAvatarTypeState);
  const avatarUrl = useAtomValue(userAvatarUrlState);

  const isMale: boolean | undefined = person
    ? person.person_data.male.value
    : isAdmin
      ? true
      : undefined;

  const [localAvatarType, setLocalAvatarType] = useState<AvatarType>(() => {
    return globalAvatarType;
  });

  const visibleSections = useMemo(
    () =>
      SECTIONS.map((section) => ({
        titleKey: section.titleKey,
        options: section.options
          .filter((opt) => {
            if (opt.gender === 'male' && isMale === false) return false;
            if (opt.gender === 'female' && isMale === true) return false;
            if (opt.type === 'google' && !avatarUrl) return false;
            return true;
          })
          .map((opt) => opt.type),
      })).filter((section) => section.options.length > 0),
    [isMale, avatarUrl]
  );

  const initials = useMemo(() => {
    const first =
      person?.person_data.person_firstname.value?.charAt(0).toUpperCase() ?? '';
    const last =
      person?.person_data.person_lastname.value?.charAt(0).toUpperCase() ?? '';
    return first + last || 'Aa';
  }, [person]);

  const availableTypes = useMemo(
    () => new Set(visibleSections.flatMap((s) => s.options)),
    [visibleSections]
  );

  useEffect(() => {
    if (open) {
      setLocalAvatarType(
        availableTypes.has(globalAvatarType) ? globalAvatarType : 'default'
      );
    }
  }, [open, globalAvatarType, availableTypes]);

  const handleSelect = (opt: AvatarType) => setLocalAvatarType(opt);

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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <Box
          sx={{
            padding: '24px 24px 0',
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
            padding: '0 24px',
            maxHeight: '60vh',
            overflowY: 'auto',
          }}
        >
          {visibleSections.map(({ titleKey, options }) => (
            <Box
              key={titleKey}
              sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <Typography className="label-small-regular" color="var(--black)">
                {t(titleKey)}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                {options.map((opt) => {
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
                        '&:hover': { opacity: 0.85 },
                      }}
                    >
                      <ProfilePicture
                        size={48}
                        typeOverride={opt}
                        alt={opt}
                        initials={opt === 'initials' ? initials : undefined}
                      />
                      {isSelected && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: -6,
                            right: -6,
                            borderRadius: '50%',
                            backgroundColor: 'var(--accent-main)',
                            border: '2px solid var(--white)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '24px',
                            height: '24px',
                          }}
                        >
                          <IconCheck
                            color="var(--always-white)"
                            width={16}
                            height={16}
                          />
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            width: '100%',
            padding: '0 24px 24px',
          }}
        >
          <Button variant="main" onClick={handleDone}>
            {t('tr_done')}
          </Button>
          <Button variant="secondary" onClick={onClose}>
            {t('tr_cancel')}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};

export default ProfilePictureSelector;
