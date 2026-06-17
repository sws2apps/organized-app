import {
  useState,
  ComponentType,
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  useCallback,
} from 'react';
import { useNavigate } from 'react-router';
import { useAtom, useAtomValue } from 'jotai';
import usePwaInstall from '@hooks/usePwaInstall';
import {
  IconInstallDesktop,
  IconInstallPhone,
  IconInstallTablet,
} from '@icons/index';
import {
  disconnectCongAccount,
  setIsAboutOpen,
  setIsAppLoad,
  setIsContactOpen,
  setIsSetup,
  setIsSupportOpen,
  setOfflineOverride,
} from '@services/states/app';
import { useBreakpoints } from '@hooks/index';
import {
  congAccountConnectedState,
  isAppLoadState,
  navBarAnchorElState,
  navBarOptionsState,
} from '@states/app';
import {
  accountTypeState,
  congNameState,
  fullnameState,
} from '@states/settings';
import { userSignOut } from '@services/firebase/auth';

import NavBarButton from '@components/nav_bar_button';
import { NavBarButtonProps } from '@components/nav_bar_button/index.types';

const lacksNativeInstallSupport = (() => {
  const ua = navigator.userAgent;
  const isSafari = /Safari/i.test(ua) && !/Chrome|CriOS|FxiOS/i.test(ua);
  const isIOS = /iPhone|iPod|iPad/i.test(ua);
  return isSafari || isIOS;
})();

type IconComponent = ComponentType<{ color?: string }>;

const useNavbar = () => {
  const navigate = useNavigate();

  const { isPwaInstallable, installPwa: pwaInstall, isStandalone } =
    usePwaInstall();

  const [iosDialogOpen, setIosDialogOpen] = useState(false);
  const handleCloseIosDialog = () => setIosDialogOpen(false);

  const { laptopUp, tabletDown, tabletUp, desktopUp, tablet688Up } =
    useBreakpoints();

  const [anchorEl, setAnchorEl] = useAtom(navBarAnchorElState);

  const fullname = useAtomValue(fullnameState);
  const congName = useAtomValue(congNameState);
  const isCongAccountConnected = useAtomValue(congAccountConnectedState);
  const isAppLoad = useAtomValue(isAppLoadState);
  const accountType = useAtomValue(accountTypeState);

  const navBarOptions = useAtomValue(navBarOptionsState);

  const openMore = Boolean(anchorEl);

  const showInstallButton =
    (isPwaInstallable || (lacksNativeInstallSupport && !isStandalone)) &&
    !isStandalone;

  let InstallIcon: IconComponent = IconInstallTablet;
  if (tabletDown) {
    InstallIcon = IconInstallPhone;
  } else if (desktopUp) {
    InstallIcon = IconInstallDesktop;
  }

  const handleOpenMoreMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseMore = () => {
    setAnchorEl(null);
  };

  const handleGoDashboard = () => {
    navigate('/');
  };

  const handleOpenMyProfile = () => {
    handleCloseMore();
    navigate(`/user-profile`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleQuickSettings = (e) => {
    e.stopPropagation();
    navBarOptions.quickSettings();
  };

  const handleReconnectAccount = () => {
    handleCloseMore();

    setOfflineOverride(true);
    setIsSetup(true);
    setIsAppLoad(true);
  };

  const handleOpenContact = async () => {
    handleCloseMore();
    setIsContactOpen(true);
  };

  const handleOpenAbout = () => {
    handleCloseMore();
    setIsAboutOpen(true);
  };

  const handleOpenSupport = () => {
    handleCloseMore();
    setIsSupportOpen(true);
  };

  const handleOpenDoc = () => {
    handleCloseMore();
    window.open(`https://guide.organized-app.com`, '_blank');
  };

  const handleOpenRealApp = () => {
    handleCloseMore();
    window.open(`https://organized-app.com`, '_blank');
  };

  const handleInstallApp = () => {
    handleCloseMore();
    if (lacksNativeInstallSupport && !isPwaInstallable) {
      setIosDialogOpen(true);
    } else {
      pwaInstall();
    }
  };

  const handleDisconnectAccount = async () => {
    handleCloseMore();

    await userSignOut();
    disconnectCongAccount();

    globalThis.location.reload();
  };

  const markLastNavBarButton = useCallback((children: ReactNode): ReactNode => {
    const flat = Children.toArray(children);

    let lastParentIndex = -1;
    let lastChildIndex: number | null = null;

    for (let i = 0; i < flat.length; i++) {
      const child = flat[i];

      if (!isValidElement(child)) continue;

      if (child.type === NavBarButton) {
        lastParentIndex = i;
        lastChildIndex = null;
        continue;
      }

      const nested = Children.toArray(
        (child.props as { children?: ReactNode }).children
      );
      for (let j = 0; j < nested.length; j++) {
        const nestedChild = nested[j];
        if (isValidElement(nestedChild) && nestedChild.type === NavBarButton) {
          lastParentIndex = i;
          lastChildIndex = j;
        }
      }
    }

    if (lastParentIndex === -1) return children;

    return flat.map((child, i) => {
      if (!isValidElement(child)) return child;

      if (i !== lastParentIndex) return child;

      if (lastChildIndex === null && child.type === NavBarButton) {
        return cloneElement(child as ReactElement<NavBarButtonProps>, {
          main: true,
        });
      }

      if (lastChildIndex !== null) {
        const nested = Children.toArray(
          (child.props as { children?: ReactNode }).children
        );
        const updatedNested = nested.map((nestedChild, j) =>
          isValidElement(nestedChild) &&
          nestedChild.type === NavBarButton &&
          j === lastChildIndex
            ? cloneElement(nestedChild as ReactElement<NavBarButtonProps>, {
                main: true,
              })
            : nestedChild
        );
        return cloneElement(child as ReactElement<{ children?: ReactNode }>, {
          children: updatedNested,
        });
      }

      return child;
    });
  }, []);

  return {
    openMore,
    handleOpenMoreMenu,
    handleCloseMore,
    anchorEl,
    handleOpenContact,
    handleOpenAbout,
    handleOpenSupport,
    handleOpenDoc,
    fullname,
    congName,
    tabletUp,
    laptopUp,
    tabletDown,
    isCongAccountConnected,
    handleOpenMyProfile,
    handleGoDashboard,
    isAppLoad,
    handleReconnectAccount,
    handleOpenRealApp,
    accountType,
    handleDisconnectAccount,
    navBarOptions,
    handleBack,
    desktopUp,
    handleQuickSettings,
    tablet688Up,
    showInstallButton,
    handleInstallApp,
    InstallIcon,
    iosDialogOpen,
    handleCloseIosDialog,
    markLastNavBarButton,
  };
};

export default useNavbar;
