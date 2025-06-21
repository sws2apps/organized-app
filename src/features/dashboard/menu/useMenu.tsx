import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { DashboardMenuProps } from './index.types';
import useCurrentUser from '@hooks/useCurrentUser';

const useMenu = ({
  path,
  onClick,
  hoverColor,
  accentHoverColor,
  activeColor,
}: DashboardMenuProps) => {
  const navigate = useNavigate();

  const { isGroup } = useCurrentUser();

  const hoverBgColor = useMemo(() => {
    if (hoverColor) return hoverColor;

    if (isGroup) {
      return 'rgba(var(--red-main-base), 0.1)';
    }

    return 'var(--accent-150)';
  }, [hoverColor, isGroup]);

  const hoverTextColor = useMemo(() => {
    if (accentHoverColor) return accentHoverColor;

    if (isGroup) {
      return 'var(--red-dark)';
    }

    return 'var(--accent-dark)';
  }, [accentHoverColor, isGroup]);

  const hoverMenuSecondaryBg = useMemo(() => {
    if (isGroup) {
      return 'rgba(var(--red-main-base), 0.4)';
    }

    return 'var(--accent-200)';
  }, [isGroup]);

  const activeBgColor = useMemo(() => {
    if (activeColor) return activeColor;

    if (isGroup) {
      return 'rgba(var(--red-main-base), 0.4)';
    }

    return 'var(--accent-200)';
  }, [activeColor, isGroup]);

  const activeMenuSecondaryBg = useMemo(() => {
    if (isGroup) {
      return 'rgba(var(--red-main-base), 0.5)';
    }

    return 'var(--accent-300)';
  }, [isGroup]);

  const handleClick = () => {
    if (path) {
      navigate(path);
      return;
    }

    onClick?.();
  };

  return {
    handleClick,
    hoverBgColor,
    hoverTextColor,
    hoverMenuSecondaryBg,
    activeBgColor,
    activeMenuSecondaryBg,
  };
};

export default useMenu;
