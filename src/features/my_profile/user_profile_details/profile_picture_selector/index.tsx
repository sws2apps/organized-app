import { useEffect, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import { useAtomValue } from 'jotai';
import { userAvatarTypeState, userAvatarUrlState } from '@states/settings';
import {
  AVATAR_IMAGE_NAMES,
  AvatarImageName,
  AvatarType,
} from '@definition/settings';
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

type AvatarGender = 'male' | 'female';

type AvatarOption = {
  type: AvatarType;
  gender?: AvatarGender;
};

type AvatarSection = {
  titleKey: string;
  options: AvatarOption[];
};

const imagesByPrefix = (prefix: string, gender?: AvatarGender) =>
  AVATAR_IMAGE_NAMES.filter((name) => name.startsWith(prefix)).map(
    (name: AvatarImageName): AvatarOption => ({ type: name, gender })
  );

const SECTIONS: AvatarSection[] = [
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
    titleKey: 'tr_person',
    options: [
      ...imagesByPrefix('Male', 'male'),
      ...imagesByPrefix('Female', 'female'),
    ],
  },
  { titleKey: 'tr_bibleStory', options: imagesByPrefix('Story') },
  { titleKey: 'tr_abstractShape', options: imagesByPrefix('Abstract') },
  { titleKey: 'tr_gradient', options: imagesByPrefix('Gradient') },
];

const ProfilePictureSelector = ({
  open,
  onClose,
}: ProfilePictureSelectorProps) => {
  const { t } = useAppTranslation();

  const { person } = useCurrentUser();

  const savedAvatarType = useAtomValue(userAvatarTypeState);
  const avatarUrl = useAtomValue(userAvatarUrlState);

  const [selectedType, setSelectedType] = useState<AvatarType>(savedAvatarType);
  const [isProcessing, setIsProcessing] = useState(false);

  // undefined keeps both the male and the female avatars visible
  const isMale = person?.person_data.male.value;

  const sections = useMemo(() => {
    const isVisible = (option: AvatarOption) => {
      if (option.gender === 'male' && isMale === false) return false;
      if (option.gender === 'female' && isMale === true) return false;

      // the account photo can only be shown when there is one
      if (option.type === 'google' && avatarUrl.length === 0) return false;

      return true;
    };

    return SECTIONS.map((section) => ({
      titleKey: section.titleKey,
      options: section.options.filter(isVisible).map((option) => option.type),
    })).filter((section) => section.options.length > 0);
  }, [isMale, avatarUrl]);

  const handleDone = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      await dbAppSettingsUpdate({
        'user_settings.user_avatar_type': {
          value: selectedType,
          updatedAt: new Date().toISOString(),
        },
      });

      onClose();
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    // the saved avatar may no longer be selectable, e.g. after the account
    // photo is gone: fall back to the generic one so a choice stays visible
    const availableTypes = sections.flatMap((section) => section.options);

    setSelectedType(
      availableTypes.includes(savedAvatarType) ? savedAvatarType : 'default'
    );
  }, [sections, savedAvatarType]);

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
            gap: '20px',
            padding: '0 24px',
            maxHeight: '60vh',
            overflowY: 'auto',
          }}
        >
          {sections.map(({ titleKey, options }) => (
            <Box
              key={titleKey}
              sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              <Typography
                id={`avatar-section-${titleKey}`}
                className="label-small-regular"
                color="var(--black)"
              >
                {t(titleKey)}
              </Typography>
              <Box
                role="radiogroup"
                aria-labelledby={`avatar-section-${titleKey}`}
                sx={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}
              >
                {options.map((option, index) => {
                  const isSelected = selectedType === option;

                  return (
                    <Box
                      key={option}
                      role="radio"
                      tabIndex={isSelected ? 0 : -1}
                      aria-checked={isSelected}
                      aria-label={`${t(titleKey)} ${index + 1}`}
                      onClick={() => setSelectedType(option)}
                      onKeyDown={(e) => {
                        if (e.key !== 'Enter' && e.key !== ' ') return;

                        e.preventDefault();
                        setSelectedType(option);
                      }}
                      sx={{
                        position: 'relative',
                        cursor: 'pointer',
                        borderRadius: 'var(--radius-max)',
                        margin: '2px',
                        outline: isSelected
                          ? '2px solid var(--accent-main)'
                          : '2px solid transparent',
                        outlineOffset: '2px',
                        '&:hover': { opacity: 0.85 },
                        '&:focus-visible': {
                          outline: '2px solid var(--accent-main)',
                        },
                      }}
                    >
                      <ProfilePicture size={48} type={option} alt="" />
                      {isSelected && (
                        <Box
                          sx={{
                            position: 'absolute',
                            bottom: -6,
                            right: -6,
                            borderRadius: 'var(--radius-max)',
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
          <Button variant="main" onClick={handleDone} disabled={isProcessing}>
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
