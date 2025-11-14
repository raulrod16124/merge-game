import {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {
  HeaderWrapper,
  Logo,
  MenuButton,
  SideMenu,
  MenuLink,
  Overlay,
} from './Header.styled';

export function Header() {
  const {pathname} = useLocation();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const menuRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ((window as any).__MERGE_GAME_HEADER_RENDERED) {
        return;
      }
      (window as any).__MERGE_GAME_HEADER_RENDERED = true;
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const handleOverlayClick = (e: React.MouseEvent) => {
    setOpen(false);
  };
  console.log('Header render, path:', pathname);
  return (
    <>
      <HeaderWrapper isFixed={!pathname.includes('/play/')}>
        <Logo>Merge Game</Logo>

        <MenuButton
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen(v => !v)}>
          {/* simple icon — you can replace with svg */}
          {open ? '✕' : '☰'}
        </MenuButton>
      </HeaderWrapper>

      {/* overlay: darkens background and catches outside clicks */}
      <Overlay open={open} onClick={handleOverlayClick} />

      {/* side menu panel */}
      <SideMenu
        role="dialog"
        aria-hidden={!open}
        aria-modal={open}
        open={open}
        ref={el => {
          menuRef.current = el;
        }}>
        <MenuLink
          onClick={() => {
            nav('/');
            setOpen(false);
          }}>
          Home
        </MenuLink>
        <MenuLink
          onClick={() => {
            nav('/levels');
            setOpen(false);
          }}>
          Niveles
        </MenuLink>
        <MenuLink onClick={() => setOpen(false)}>Cerrar</MenuLink>
      </SideMenu>
    </>
  );
}
