import { useState } from 'react';

const useMobileMenu = () => {
  const [mobileMenu, setMobileMenu] = useState(false);

  const openMenu = () => setMobileMenu(true);
  const closeMenu = () => setMobileMenu(false);

  return {
    mobileMenu,
    openMenu,
    closeMenu,
  };
};

export default useMobileMenu;