import { KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { userAvatarTypeState, userAvatarState } from '@states/settings';
import {
  AVATAR_IMAGE_NAMES,
  AvatarImageName,
  AvatarType,
} from '@definition/settings';
import { useAppTranslation } from '@hooks/index';
import useCurrentUser from '@hooks/useCurrentUser';
import { dbAppSettingsUpdate } from '@services/dexie/settings';
import { STORY_NAME_KEYS } from './avatar_names';

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

const useProfilePictureSelector = (onClose: () => void) => {
  const { t } = useAppTranslation();

  const { person } = useCurrentUser();

  const savedAvatarType = useAtomValue(userAvatarTypeState);
  const avatarBuffer = useAtomValue(userAvatarState);

  const hasAvatar = avatarBuffer !== undefined;

  const [selectedType, setSelectedType] = useState<AvatarType>(savedAvatarType);
  const [isProcessing, setIsProcessing] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const savingRef = useRef(false);
  const optionRefs = useRef(new Map<AvatarType, HTMLButtonElement>());

  const isMale = person?.person_data.male.value === true;
  const isFemale = person?.person_data.female.value === true;
  let gender: AvatarGender | undefined;
  if (isMale !== isFemale) {
    gender = isMale ? 'male' : 'female';
  }

  const sections = useMemo(() => {
    const isVisible = (option: AvatarOption) => {
      if (option.gender && option.gender !== gender) return false;

      // the account photo can only be shown when there is one
      if (option.type === 'google' && !hasAvatar) return false;

      return true;
    };

    return SECTIONS.map((section) => ({
      titleKey: section.titleKey,
      options: section.options.filter(isVisible).map((option) => option.type),
    })).filter((section) => section.options.length > 0);
  }, [gender, hasAvatar]);

  const handleDone = async () => {
    if (savingRef.current) return;
    if (selectedType === savedAvatarType) {
      onClose();
      return;
    }
    savingRef.current = true;
    setSaveError(false);

    setIsProcessing(true);

    try {
      await dbAppSettingsUpdate({
        'user_settings.user_avatar_type': {
          value: selectedType,
          updatedAt: new Date().toISOString(),
        },
      });

      onClose();
    } catch {
      setSaveError(true);
    } finally {
      savingRef.current = false;
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    // reconcile whenever the set of available types changes (not only when
    // the saved type changes): sections is memoized on a presence boolean,
    // so unrelated settings writes cannot rebuild it and silently reset the
    // selection while the dialog is open
    const availableTypes = sections.flatMap((section) => section.options);

    // preserve an in-progress choice while it remains available
    if (availableTypes.includes(selectedType)) return;

    // the selection is no longer offered, e.g. the account photo disappeared:
    // fall back to the saved avatar when still selectable, otherwise to the
    // generic one so a radio always stays selected
    const fallback = availableTypes.includes(savedAvatarType)
      ? savedAvatarType
      : 'default';

    setSelectedType(fallback);
    setActiveTab(
      Math.max(
        0,
        sections.findIndex((section) => section.options.includes(fallback))
      )
    );
  }, [sections, savedAvatarType, selectedType]);

  const handleClose = () => {
    if (!savingRef.current) onClose();
  };

  const getName = (option: AvatarType, titleKey: string, index: number) => {
    if (option in STORY_NAME_KEYS)
      return t(STORY_NAME_KEYS[option as keyof typeof STORY_NAME_KEYS]);
    if (option === 'default') return t('tr_avatarDefault');
    if (option === 'initials') return t('tr_avatarInitials');
    if (option === 'google') return t('tr_avatarAccountPhoto');
    return `${t(titleKey)} ${index + 1}`;
  };

  const handleOptionKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    options: AvatarType[],
    index: number
  ) => {
    const direction = getComputedStyle(event.currentTarget).direction;
    const forward = direction === 'rtl' ? 'ArrowLeft' : 'ArrowRight';
    const backward = direction === 'rtl' ? 'ArrowRight' : 'ArrowLeft';
    let next: number;
    if (event.key === forward || event.key === 'ArrowDown')
      next = (index + 1) % options.length;
    else if (event.key === backward || event.key === 'ArrowUp')
      next = (index - 1 + options.length) % options.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = options.length - 1;
    else return;
    event.preventDefault();
    setSelectedType(options[next]);
    optionRefs.current.get(options[next])?.focus();
  };

  return {
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
  };
};

export default useProfilePictureSelector;
