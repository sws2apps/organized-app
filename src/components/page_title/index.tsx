import { NavBarOptionsType } from '@definition/app';
import { navBarOptionsState } from '@states/app';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

const PageTitle = (props: NavBarOptionsType) => {
  const setNavBarOptions = useSetAtom(navBarOptionsState);

  useEffect(() => {
    setNavBarOptions(props);
  }, [props, setNavBarOptions]);

  return null;
};

export default PageTitle;
