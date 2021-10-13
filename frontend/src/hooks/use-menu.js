import { useRef, useState } from 'react';


function useMenu() {
  const btnRef = useRef();
  const [anchor, setAnchor] = useState(null);

  const menuOpen = !!anchor;

  function clickButton(e) {
    e.stopPropagation();
    setAnchor(menuOpen ? null : btnRef.current);
  }

  function closeMenu() {
    setAnchor(null);
  }

  return {
    buttonProps: {
      ref: btnRef,
      onClick: clickButton
    },
    menuProps: {
      anchorEl: anchor,
      onClose: closeMenu,
      getContentAnchorEl: null,
      open: menuOpen,
      anchorOrigin: {
        horizontal: 'center',
        vertical: 'bottom'
      },
      transformOrigin: {
        horizontal: 'center',
        vertical: 'top'
      }
    },
    closeMenu
  };
}

export default useMenu;