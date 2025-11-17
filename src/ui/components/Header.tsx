// src/ui/components/Header.tsx
import {useState, useRef, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {
  HeaderBar,
  Left,
  Logo,
  Right,
  NavPill,
  MobileMenuBtn,
  SidePanel,
  Overlay,
  NavList,
} from './Header.styled';
import {Button} from '@/common/Button';

export function Header() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!open) return;
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener('mousedown', onDown);
    return () => window.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <>
      <HeaderBar>
        <Left>
          <Logo>
            <Link to="/">Stellar Merge</Link>
          </Logo>
        </Left>

        <Right>
          <nav aria-label="Main navigation">
            <NavPill variant="primary" to="/">
              Home
            </NavPill>
            <NavPill variant="secondary" to="/levels">
              Niveles
            </NavPill>
          </nav>

          <MobileMenuBtn onClick={() => setOpen(true)} aria-label="Abrir menú">
            ☰
          </MobileMenuBtn>
        </Right>
      </HeaderBar>

      {open && <Overlay onClick={() => setOpen(false)} />}

      <SidePanel ref={panelRef} open={open}>
        <NavList>
          <Link to="/" onClick={() => setOpen(false)}>
            Inicio
          </Link>
          <Link to="/levels" onClick={() => setOpen(false)}>
            Niveles
          </Link>
          <Link to="/about" onClick={() => setOpen(false)}>
            Acerca
          </Link>
        </NavList>
      </SidePanel>
    </>
  );
}
