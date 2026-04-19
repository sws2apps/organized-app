import { useState, useEffect } from 'react';
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

type SectionDef = {
  titleKey: string;
  options: AvatarType[];
  gender?: 'male' | 'female';
};

const SECTIONS: SectionDef[] = [
  {
    titleKey: 'tr_basic',
    options: ['default', 'initials', 'google'],
  },
  {
    titleKey: 'tr_basic',
    options: ['MaleIcon1', 'MaleIcon2', 'MaleIcon3'],
    gender: 'male',
  },
  {
    titleKey: 'tr_basic',
    options: ['FemaleIcon1', 'FemaleIcon2', 'FemaleIcon3'],
    gender: 'female',
  },
  {
    titleKey: 'tr_gradient',
    options: [
      'GradientOrange',
      'GradientBrown',
      'GradientLime',
      'GradientGreen',
      'GradientBlue',
      'GradientPurple',
      'GradientPink',
    ],
  },
  {
    titleKey: 'tr_person',
    options: ['Male1', 'Male2', 'Male3', 'Male4'],
    gender: 'male',
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
      'StoryDesert',
      'StoryField',
      'StoryFigs',
      'StoryLamp',
      'StoryLeaves',
      'StoryLion',
      'StoryLionScripture',
      'StoryPearl',
      'StoryRod',
      'StorySeeds',
      'StorySheep',
      'StoryWatchtower',
    ],
  },
];

const ProfilePictureSelector = ({
  open,
  onClose,
}: ProfilePictureSelectorProps) => {
  const { t } = useAppTranslation();
  const { person, isAdmin } = useCurrentUser();

  const isMale: boolean | undefined = person
    ? person.person_data.male.value
    : isAdmin
      ? true
      : undefined;

  const globalAvatarType = useAtomValue(userAvatarTypeState);
  const avatarUrl = useAtomValue(userAvatarUrlState);

  const [localAvatarType, setLocalAvatarType] =
    useState<AvatarType>(globalAvatarType);

  const availableSet = new Set<AvatarType>(
    SECTIONS.flatMap((s) => {
      if (s.gender === 'male' && isMale === false) return [];
      if (s.gender === 'female' && isMale === true) return [];
      return s.options.filter((opt) => opt !== 'google' || !!avatarUrl);
    })
  );

  const visibleSections = (() => {
    const seenTitles = new Set<string>();
    const grouped: Record<string, AvatarType[]> = {};

    for (const section of SECTIONS) {
      const available = section.options.filter((opt) => availableSet.has(opt));
      if (available.length === 0) continue;
      if (!grouped[section.titleKey]) {
        grouped[section.titleKey] = [];
        seenTitles.add(section.titleKey);
      }
      grouped[section.titleKey].push(...available);
    }

    return Array.from(seenTitles).map((titleKey) => ({
      titleKey,
      options: grouped[titleKey],
    }));
  })();

  useEffect(() => {
    if (open) {
      const safeType = availableSet.has(globalAvatarType)
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
                      aria-label={t(titleKey)}
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
                      <ProfilePicture size={48} typeOverride={opt} alt={opt} />
                      {isSelected && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: -4,
                            right: -4,
                            borderRadius: '50%',
                            backgroundColor: 'var(--accent-main)',
                            border: '2px solid var(--always-white)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '24px',
                            height: '24px',
                          }}
                        >
                          <IconCheck
                            color="var(--always-white)"
                            width={12}
                            height={12}
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
